'use client';

import {SessionProvider} from "next-auth/react"
import {ReactNode} from "react"
import SessionGuard from "@/components/Providers/SessionGuard";

export function SecurityProviders({ children }: { children: ReactNode }) {
    const authUrl: string = (process.env.NEXT_PUBLIC_NEXTAUTH_URL ? process.env.NEXT_PUBLIC_NEXTAUTH_URL : "");

    return (
       <SessionProvider refetchInterval={4 * 60} basePath={authUrl}>
           <SessionGuard>
                {children}
           </SessionGuard>
        </SessionProvider>
    )
}
