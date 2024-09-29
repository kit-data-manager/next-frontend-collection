"use client";
import { signIn, useSession } from "next-auth/react";
import { ReactNode, useEffect } from "react";
import federatedLogout from "@/lib/federatedLogout";

export default function SessionGuard({ children }: { children: ReactNode }) {
    const { data, status } = useSession();

    useEffect(() => {
        if (data?.error  === "RefreshAccessTokenError") {
            signIn('keycloak', {
                callbackUrl: `${process.env.NEXTAUTH_URL}/`,
            }).catch(error => {console.error("SignIn failed, clearing session.", error); federatedLogout();}); // Force sign in to hopefully resolve error
        }
    }, [data, status]);

    return (
        <>
            {children}
        </>
    );
}
