import KeycloakProvider from 'next-auth/providers/keycloak'

import type {JWT} from 'next-auth/jwt';
import {AdapterUser} from "next-auth/adapters";
import {ExtendedProfile} from "@/lib/definitions";
import NextAuth, {Account, NextAuthOptions, Session, User} from 'next-auth'
/**
 * Takes a token, and returns a new token with updated
 * `accessToken` and `accessTokenExpires`. If an error occurs,
 * returns the old token and an error property
 */
/**
 * @param  {JWT} token
 */
const refreshAccessToken = async (token: JWT) => {
    if (Date.now() > token.refreshTokenExpired) {
        console.error("Refresh token expired. Returning RefreshAccessTokenError.");
        return {
            ...token,
            error: 'RefreshAccessTokenError',
        };
    }

    try {
        const details = {
            client_id: process.env.KEYCLOAK_CLIENT_ID,
            client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
            grant_type: ['refresh_token'],
            refresh_token: token.refreshToken,
        };
        const formBody: string[] = [];
        Object.entries(details).forEach(([key, value]: [string, any]) => {
            const encodedKey = encodeURIComponent(key);
            const encodedValue = encodeURIComponent(value);
            formBody.push(encodedKey + '=' + encodedValue);
        });
        const formData = formBody.join('&');

        const url = new URL(`${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
            },
            body: formData,
        });
        const refreshedTokens = await response.json();

        if (!response.ok) {
            console.error("Token refresh returned error status. Returning RefreshAccessTokenError.");
            return {
                ...token,
                error: 'RefreshAccessTokenError',
            };
        } else {
            return {
                ...token,
                accessToken: refreshedTokens.access_token,
                accessTokenExpired: Date.now() + (refreshedTokens.expires_in - 15) * 1000,
                refreshToken: refreshedTokens.refresh_token ?? token.refreshToken,
                refreshTokenExpired:
                    Date.now() + (refreshedTokens.refresh_expires_in - 15) * 1000,
            };
        }
    } catch (error) {
        console.error("Some unhandled error occurred while token refresh. Returning RefreshAccessTokenError.");
        return {
            ...token,
            error: 'RefreshAccessTokenError',
        };
    }
};

const keycloakProvider = KeycloakProvider({
    clientId: process.env.KEYCLOAK_CLIENT_ID,
    clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
    issuer: process.env.KEYCLOAK_ISSUER,
    authorization: {
        params: {
            grant_type: 'authorization_code',
            scope: 'openid email profile',
            response_type: 'code'
        }
    },
    httpOptions: {
        timeout: 30000
    }
})


export const authOptions: NextAuthOptions = {
    providers: [keycloakProvider],
    session: {
        strategy: "jwt"
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        /**
         * @param  {object} user     User object
         * @param  {object} account  Provider account
         * @param  {object} profile  Provider profile
         * @param  {string} email    Email
         * @return {boolean|string}  Return `true` to allow sign in
         *                           Return `false` to deny access
         *                           Return `string` to redirect to (eg.: "/unauthorized")
         */
        async signIn({user, account, profile, email}) {
            if (account && user) {
                return true;
            } else {
                // TODO : Add unauthorized page
                //return '/unauthorized';
                return false;
            }
        },
        /**
         * @param  {string} url      URL provided as callback URL by the client
         * @param  {string} baseUrl  Default base URL of site (can be used as fallback)
         * @return {string}          URL the client will be redirected to
         */
        async redirect({url, baseUrl}) {
            if (url.startsWith("/")) return `${baseUrl}${url}`
            else if (new URL(url).origin === baseUrl) return url
            return baseUrl
        },
        /**
         * @param  {object} session      Session object
         * @param  {object} user         User object
         * @param  {object} token        User object    (if using database sessions)
         *                               JSON Web Token (if not using database sessions)
         * @return {object}              Session that will be returned to the client
         */
        async session({session, token, user}: { session: Session, token: JWT, user: User }) {
            if (token) {
                session.user = token.user;
                session.accessToken = token.accessToken;
                session.error = token.error;
            }
            return session;
        },
        /**
         * @param  {object}  token     Decrypted JSON Web Token
         * @param  {object}  user      User object      (only available on sign in)
         * @param  {object}  account   Provider account (only available on sign in)
         * @param  {object}  profile   Provider profile (only available on sign in)
         * @param  {boolean} isNewUser True if new user (only available on sign in)
         * @return {object}            JSON Web Token that will be saved
         */
        async jwt({token, user, account, profile, trigger, isNewUser, session}: {
            token: JWT;
            user: User | AdapterUser;
            account: Account | null;
            profile?: ExtendedProfile | undefined;
            trigger?: "signIn" | "signUp" | "update" | undefined;
            isNewUser?: boolean | undefined;
            session?: any;
        }) {
            // Initial sign in
            if (account && user) {
                // Add access_token, refresh_token and expirations to the token right after sign in
                token.accessToken = account.access_token;
                token.refreshToken = account.refresh_token;
                token.accessTokenExpired = Date.now() + (account.expires_in - 15) * 1000;
                token.refreshTokenExpired = Date.now() + (account.refresh_expires_in - 15) * 1000;
                token.user = user;
                token.user.preferred_username = profile?.preferred_username;
                token.user.groups = profile?.groups;
                return token;
            }

            // Return previous token if the access token has not expired yet
            if (Date.now() < token.accessTokenExpired) return token;

            // Access token has expired, try to update it
            return refreshAccessToken(token);
        },
    },
}

export default NextAuth(authOptions);


