"use client"
import { signIn } from "next-auth/react";
import {Icon} from "@iconify/react";
import React from "react";
export default function Login(icon:boolean, style: string) {
    console.log(icon);
    console.log(style);
    if(icon){
        return (
            <a onClick={() => signIn("keycloak")} className={style}>
                <Icon className={"w-12 h-12"} icon="pepicons-pencil:key-circle" />
            </a>
        )
    }

    return (<button onClick={() => signIn("keycloak")} className={style}>
        Login
    </button>)
}
