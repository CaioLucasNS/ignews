import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"

import { query as q } from 'faunadb';
import { fauna } from '../../../services/fauna';

export default NextAuth({
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
            //   @ts-ignore
            scope: 'read:user',
        }),
    ],
    jwt: {
        secret: process.env.SIGNING_KEY,
    },
    callbacks: {
        async signIn({ user, account, profile, credentials }) {
            const { email } = user;

            try {
                await fauna.query(
                    q.If(
                        q.Not(
                            q.Exists(
                                q.Match( // = WHERE
                                    q.Index('user_by_email'),
                                    // @ts-ignore
                                    q.Casefold(email) // lowercase 
                                )
                            )
                        ),
                        q.Create(
                            q.Collection('users'),
                            { data: { email } }
                        ),

                        q.Get( // = SELECT
                            q.Match( // = WHERE
                                q.Index('user_by_email'),
                                // @ts-ignore
                                q.Casefold(email) // lowercase
                            )
                        )
                    )
                );
                return true
            } catch {
                return false
            }

        },
    }
})