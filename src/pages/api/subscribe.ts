import { fauna } from "@/src/services/fauna";
import { stripe } from "@/src/services/stripe";
import { query as q } from "faunadb";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

type User = {
  ref: {
    id: string;
  }
  data: {
    stripe_customer_id: string
  }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const session = await getSession({ req });

    const user = await fauna.query<User>(
      q.Get(
        q.Match(
          q.Index('user_by_email'),
          // @ts-ignore
          q.Casefold(session?.user?.email)
        )
      )
    )

    let costumerId = user.data.stripe_customer_id;

    if (!costumerId) {
      const stripeCustomer = await stripe.customers.create({
        email: session?.user?.email as string,
        // metadata
      });

      await fauna.query(
        q.Update(
          q.Ref(q.Collection('users'), user.ref.id),
          {
            data: {
              stripe_customer_id: stripeCustomer.id
            }
          }
        )
      )

      costumerId = stripeCustomer.id
    }



    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: costumerId, // id in Stripe
      payment_method_types: ["card"],
      billing_address_collection: "required",
      line_items: [{ price: "price_1MlA5xLIj6uklDb5JxgQOCJu", quantity: 1 }],
      mode: "subscription",
      allow_promotion_codes: true,
      success_url: process.env.STRIPE_SUCCESS_URL as string,
      cancel_url: process.env.STRIPE_CANCEL_URL,
    });

    res.status(200).json({ sessionId: stripeCheckoutSession.id });
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method not allowed");
  }
};
