'use client'

import { SessionProvider } from "next-auth/react"
import { ReactNode } from "react"

export function Providers({ children }: { children: ReactNode }) {
    const sec = false;
    return (
       <SessionProvider refetchInterval={4 * 60}>
            {children}
        </SessionProvider>
    )
}
