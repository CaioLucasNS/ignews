import { stripe } from "@/src/services/stripe";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === "POST") {
    const session = await getSession({ req });

    const stripeCostumer = await stripe.customers.create({
      email: session?.user?.email as string,
      // metadata
    });

    const stripeCheckoutSession = await stripe.checkout.sessions.create({
      customer: stripeCostumer.id, // id in Stripe
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
