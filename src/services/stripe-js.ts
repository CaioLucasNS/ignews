import { loadStripe } from "@stripe/stripe-js";

export const getStripeJs = async ({ sessionId }: any) => {
  const stripeJs = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string);

  const result = await stripeJs?.redirectToCheckout({ sessionId });

  return result;
}