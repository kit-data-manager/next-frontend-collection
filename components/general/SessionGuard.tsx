"use client";
import { signIn, useSession } from "next-auth/react";
import { ReactNode, useEffect } from "react";
import {Session} from "next-auth";

export default function SessionGuard({ children }: { children: ReactNode }) {
    const { data, status } = useSession();
    useEffect(() => {
        //if (data?.error === "RefreshAccessTokenError") {
        if (status === "unauthenticated") {
            signIn("keycloak");
        }
    }, [data]);

    return <>{children}</>;
}
