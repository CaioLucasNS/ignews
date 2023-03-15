import { api } from "@/src/services/api";
import { getStripeJs } from "../../services/stripe-js";
import { signIn, useSession } from "next-auth/react";
import styles from "./styles.module.scss";

interface SubscribeButtonProps {
  priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
  const { data: session } = useSession();

  async function handleSubscribe() {
    if (!session) {
      signIn("github");
      return;
    }

    // criação da checkout session
    try {
      const response = await api.post('/subscribe');

      const { sessionId } = response.data;

      getStripeJs({ sessionId });

    } catch (error) {
      // @ts-ignore
      alert(error.message)
    }
  }

  return (
    <button
      type="button"
      className={styles.subscribeButton}
      onClick={handleSubscribe}
    >
      Subscribe now
    </button>
  );
}
