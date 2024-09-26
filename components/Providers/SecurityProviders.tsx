'use client';

import { SessionProvider } from "next-auth/react"
import {ReactNode, useEffect, useState} from "react"
import SessionGuard from "@/components/Providers/SessionGuard";

export function SecurityProviders({ children }: { children: ReactNode }) {
    return (
       <SessionProvider refetchInterval={4 * 60}>
           <SessionGuard>
                {children}
           </SessionGuard>
        </SessionProvider>
    )
}
