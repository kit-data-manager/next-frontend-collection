"use client";

import {signIn, useSession} from "next-auth/react";
import {Icon} from "@iconify/react";
import React from "react";
import federatedLogout from "@/lib/federatedLogout";
import {useRouter} from "next/navigation";

export default function LoginLogoutButton({icon, ...props}) {
    const {data: session, status} = useSession();
    const { push } = useRouter();
    if (status === "authenticated" && session) {
        //authenticated || session, show logout
        if (icon) {
            return (
                <button title="Logout" onClick={() => federatedLogout()} {...props}>
                    <Icon className="w-6 h-6 pointer-events:auto" icon="pepicons-pencil:key-circle-off"/>
                </button>
            )
        }

        return <button title="Logout" onClick={() => federatedLogout()}>
            Logout
        </button>
    } else {
        //!authenticated || !session, show login
        if (icon) {
            return (
                <button title="Login" onClick={() => signIn("keycloak")} {...props}>
                    <Icon className="w-6 h-6 pointer-events:auto" icon="pepicons-pencil:key-circle"/>
                </button>
            )
        }
        return (
            <button title="Login" onClick={() => signIn("keycloak")} {...props}>
                Login
            </button>
        )
    }
}
