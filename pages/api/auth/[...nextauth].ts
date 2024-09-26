import NextAuth from 'next-auth';
import KeycloakProvider from 'next-auth/providers/keycloak'
import CredentialsProvider from "next-auth/providers/credentials"

import type { JWT } from 'next-auth/jwt';

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
        console.error("Token already expired. Returning RefreshAccessTokenError.");
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

        if (!response.ok){
            console.error("Token refresh returned error status. Returning RefreshAccessTokenError.");
            return {
                ...token,
                error: 'RefreshAccessTokenError',
            };
        }else{
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
        console.error("Some unhandled error occured while token refresh. Returning RefreshAccessTokenError.");
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
         scope:'openid email profile',
         response_type: 'code'
     }
   },
   httpOptions: {
     timeout: 30000
   }
 })
const credentialsProvider =  CredentialsProvider({
    // The name to display on the sign in form (e.g. 'Sign in with...')
    name: 'Credentials',
    // The credentials is used to generate a suitable form on the sign in page.
    // You can specify whatever fields you are expecting to be submitted.
    // e.g. domain, username, password, 2FA token, etc.
    // You can pass any HTML attribute to the <input> tag through the object.
    credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" }
       // password: { label: "Password", type: "password" }
    },
    async authorize(credentials, req) {
        // You need to provide your own logic here that takes the credentials
        // submitted and returns either a object representing a user or value
        // that is false/null if the credentials are invalid.
        // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
        // You can also use the `req` object to obtain additional parameters
        // (i.e., the request IP address)
        /*const res = await fetch("/your/endpoint", {
            method: 'POST',
            body: JSON.stringify(credentials),
            headers: { "Content-Type": "application/json" }
        })
        const user = await res.json()
*/
        // If no error and we have user data, return it
       /* if (res.ok && user) {
            return user
        }*/
        // Return null if user data could not be retrieved
        return {"username": credentials?.username};
    }
})


export default NextAuth({
    providers: [credentialsProvider],
    session: {
        strategy: "jwt"
    },
    jwt: {
        signingKey: process.env.SIGNING_KEY,
    },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        /**
         * @param  {object} user     User object
         * @param  {object} account  Provider account
         * @param  {object} profile  Provider profile
         * @return {boolean|string}  Return `true` to allow sign in
         *                           Return `false` to deny access
         *                           Return `string` to redirect to (eg.: "/unauthorized")
         */
        async signIn({ user, account, profile, email, credentials }) {
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
         * @return {string}          URL the client will be redirect to
         */
        async redirect({ url, baseUrl }) {
            //return url.startsWith(baseUrl) ? url : baseUrl;
            if (url.startsWith("/")) return `${baseUrl}${url}`
            else if (new URL(url).origin === baseUrl) return url
            return baseUrl
        },
        /**
         * @param  {object} session      Session object
         * @param  {object} token        User object    (if using database sessions)
         *                               JSON Web Token (if not using database sessions)
         * @return {object}              Session that will be returned to the client
         */
        //async session(session, token: JWT) {
        async session({ session, user, token }) {
            if (token) {
                session.user = token.user;
                session.error = token.error;
                session.accessToken = token.accessToken;
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
        async jwt({ token, user, account, profile, isNewUser }) {
            // Initial sign in
            if (account && user) {
                // Add access_token, refresh_token and expirations to the token right after signin
                token.accessToken = account.access_token;
                token.refreshToken = account.refresh_token;
                token.accessTokenExpired = Date.now() + (account.expires_in - 15) * 1000;
                token.refreshTokenExpired = Date.now() + (account.refresh_expires_in - 15) * 1000;
                token.user = user;
                return token;
            }

            // Return previous token if the access token has not expired yet
            if (Date.now() < token.accessTokenExpired) return token;

            // Access token has expired, try to update it
            return refreshAccessToken(token);
        },
    },
});


