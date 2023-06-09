import { stripe } from "@/src/services/stripe";
import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from 'stream';
import Stripe from "stripe";
import { saveSubscription } from "./_lib/manageSubscription";

async function buffer(readable: Readable) {
    const chunks = [];

    for await (const chunk of readable) {
        chunks.push(
            typeof chunk === 'string' ? Buffer.from(chunk) : chunk
        );
    }

    return Buffer.concat(chunks);
}

export const config = {
    api: {
        bodyParser: false
    }
}

const relevantEvents = new Set([
    'checkout.session.completed',
    'customer.subscription.updated',
    'customer.subscription.deleted'
]);

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'POST') {
        const buf = await buffer(req);
        const secret = req.headers['stripe-signature']

        let event: Stripe.Event;

        try {
            event = stripe.webhooks.constructEvent(
                buf,
                // @ts-ignore
                secret,
                process.env.STRIPE_WEBHOOK_SECRET
            );
        } catch (err) {
            // @ts-ignore
            return res.status(400).send(`Webhook error: ${err.message}`);
        }

        const { type } = event;

        if (relevantEvents.has(type)) {
            try {
                switch (type) {
                    case 'customer.subscription.updated':
                    case 'customer.subscription.deleted':
                        const subscription = event.data.object as Stripe.Subscription;

                        await saveSubscription(
                            subscription.id as string,
                            subscription.customer as string,
                            false
                        );

                        break;
                    case 'checkout.session.completed':

                        const checkoutSession = event.data.object as Stripe.Checkout.Session;

                        await saveSubscription(
                            checkoutSession.subscription as string,
                            checkoutSession.customer as string,
                            true
                        )

                        break;

                    default:
                        throw new Error('Unhandled event.')
                }
            } catch (err) {
                // it is not returning an error because of stripe problem
                return res.json({ error: 'Webhook handler failed.' })
            }
        }

        res.status(200).json({ ok: true })
    } else {
        res.setHeader('Allow', 'POST')
        res.status(405).end('Method not allowed')
    }
}