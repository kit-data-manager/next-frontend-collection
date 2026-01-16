"use client";

import {signIn, useSession} from "next-auth/react";
import {Icon} from "@iconify-icon/react";
import React from "react";
import {redirect} from "next/navigation";

export default function LoginLogoutButton({icon, ...props}) {
    const {data: session, status} = useSession();
    if (status === "authenticated" && session) {
        //authenticated || session, show logout
        if (icon) {
            return (
                <button   className="inline-flex h-6 w-6 items-center justify-center"
                          title="Logout" onClick={() => redirect("/api/auth/federated-logout")} {...props}>
                    <Icon  width={"24"} height={"24"} className="w-6 h-6 pointer-events:auto" icon="pepicons-pencil:key-circle-off"/>
                </button>
            )
        }

        return <button title="Logout" onClick={() => redirect("/api/auth/federated-logout")}>
            Logout
        </button>
    } else {
        //!authenticated || !session, show login
        if (icon) {
            return (
                <button title="Login"  className="inline-flex h-6 w-6 items-center justify-center" onClick={() => signIn("keycloak")} {...props}>
                    <Icon width={"24"} height={"24"} className="w-6 h-6 pointer-events:auto" icon="pepicons-pencil:key-circle"/>
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
