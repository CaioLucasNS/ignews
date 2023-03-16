import { fauna } from "@/src/services/fauna";
import { stripe } from "@/src/services/stripe";
import { query as q } from 'faunadb';

export async function saveSubscription(
    subscriptionId: string,
    customerId: string,
) {
    // 1. Buscar o usuário no FaunaDB com o ID {customerId}
    // 1. Search for the user in FaunaDB with the ID {customerId}
    const userRef = await fauna.query(
        q.Select(
            'ref',
            q.Get(
                q.Match(
                    q.Index('user_by_stripe_customer_id'),
                    customerId
                )
            )
        )
    )

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    const subscriptionData = {
        id: subscription.id,
        userId: userRef,
        status: subscription.status,
        priceId: subscription.items.data[0].price.id,
    }

    // 2. Salvar os dados da subscription no FaunaDB
    // 2. Save subscription data in FaunaDB
    await fauna.query(
        q.Create(
            q.Collection('subscriptions'),
            {
                data: subscriptionData
            }
        )
    )

}