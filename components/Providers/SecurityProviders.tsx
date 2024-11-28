'use client';

import { SessionProvider } from "next-auth/react"
import {ReactNode, useEffect, useState} from "react"
import SessionGuard from "@/components/Providers/SessionGuard";

export function SecurityProviders({ children }: { children: ReactNode }) {
    const basePath: string = (process.env.NEXT_PUBLIC_BASE_PATH ? process.env.NEXT_PUBLIC_BASE_PATH : "");

    return (
       <SessionProvider refetchInterval={4 * 60} >
           <SessionGuard>
                {children}
           </SessionGuard>
        </SessionProvider>
    )
}
