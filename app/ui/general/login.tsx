"use client"
import { signIn } from "next-auth/react";
export default function Login(...props) {
    return <button onClick={() => signIn("keycloak")} class={props[0].className}>
        Login
    </button>
}
