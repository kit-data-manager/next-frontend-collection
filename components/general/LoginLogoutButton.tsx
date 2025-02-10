"use client";

import {signIn, useSession} from "next-auth/react";
import {Icon} from "@iconify/react";
import React from "react";
import {redirect} from "next/navigation";

export default function LoginLogoutButton({icon, ...props}) {
    const {data: session, status} = useSession();
    if (status === "authenticated" && session) {
        //authenticated || session, show logout
        if (icon) {
            return (
                <button title="Logout" onClick={() => redirect("/api/auth/federated-logout")} {...props}>
                    <Icon className="w-6 h-6 pointer-events:auto" icon="pepicons-pencil:key-circle-off"/>
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
