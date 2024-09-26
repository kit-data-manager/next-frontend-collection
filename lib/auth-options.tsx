import {AuthOptions, TokenSet} from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";
import {JWT} from "next-auth/jwt";
import {User, Account} from "next-auth";

export const authOptions: AuthOptions = {
    providers: [
        KeycloakProvider({
            clientId: process.env.KEYCLOAK_CLIENT_ID,
            clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
            issuer: process.env.KEYCLOAK_ISSUER
        })
    ],
    session: {
        maxAge: 60 * 30
    },
    callbacks: {
        async jwt({token, user, account}: {
            token: JWT;
            user: User;
            account:Account;
        }){
            //{ token:JWT, user, account }) {
         //   return { ...token, ...user };
            if (account) {
                token.idToken = account.id_token
                token.accessToken = account.access_token
                token.refreshToken = account.refresh_token
                token.expiresAt = account.expires_at
                return token
            }
            // we take a buffer of one minute(60 * 1000 ms)
            if (Date.now() < (token.accessTokenExpired * 1000 - 60 * 1000)) {
                return token
            } else {
                try {
                    const response = await requestRefreshOfAccessToken(token)

                    const tokens: TokenSet = await response.json()

                    if (!response.ok){
                        console.error("Refreshing access token returned error code. ", error)
                        return { ...token, error: "RefreshAccessTokenError" }
                    }

                    const updatedToken: JWT = {
                        ...token, // Keep the previous token properties
                        idToken: tokens.id_token,
                        accessToken: tokens.access_token ? token.accessToken : "",
                        expiresAt: Math.floor(Date.now() / 1000 + (tokens.expires_in as number)),
                        refreshToken: tokens.refresh_token ?? token.refreshToken,
                    }
                    return updatedToken
                } catch (error) {
                    console.error("Error refreshing access token", error)
                    return { ...token, error: "RefreshAccessTokenError" }
                }
            }
        },
        async session({ session, token }) {
            /* session.accessToken = token.accessToken
             return session*/
            return { ...session, user: token };
        }
    }
    /*
    * session: {
		strategy: "jwt",
	},
	pages: {
		signIn: "/signin",
		signOut: "/signout",
		newUser: "/signup",
	},
    * */
}

function requestRefreshOfAccessToken(token: JWT) {
    return fetch(`${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
            client_id: process.env.KEYCLOAK_CLIENT_ID,
            client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
            grant_type: "refresh_token",
            refresh_token: token.refreshToken as string
        }),
        method: "POST",
        cache: "no-store"
    });
}
