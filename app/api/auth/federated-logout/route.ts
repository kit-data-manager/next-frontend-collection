import * as jwt from "next-auth/jwt"
import {JWT} from "next-auth/jwt"
import {NextRequest} from "next/server"
import {redirect} from "next/navigation"
import nextConfig from "@/next.config"

function federatedLogout(logoutPath: string) {

    return async function (req: NextRequest) {
        let token: JWT | null

        try {
            token = await jwt.getToken({ req, secret: process.env.NEXTAUTH_SECRET })
        } catch (error) {
            console.error("Failed to properly logout.", error);
            redirect("/logout")
        }

        if (!token) {
            console.warn("No JWT token found when calling /federated-logout endpoint")
            return redirect(process.env.NEXTAUTH_URL || "/")
        }

        const endsessionURL = `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/logout`

        if (token.idToken) {
            console.warn("Without an id_token the user won't be redirected back from the IdP after logout.")

            const endsessionParams = new URLSearchParams({
                id_token_hint: token.idToken as string,
                post_logout_redirect_uri: process.env.NEXTAUTH_URL + logoutPath || ""
            })

            return redirect(`${endsessionURL}?${endsessionParams}`)
        } else {
            return redirect(`${endsessionURL}`)
        }
    }
}

const handler = federatedLogout("/logout")

export { handler as GET }
