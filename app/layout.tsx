import '@/app/global.css';
import {inter} from '@/components/fonts';
import React from "react";
import {Providers} from "@/app/Providers";
import SessionGuard from "@/components/general/SessionGuard";

export default function RootLayout({children}: {
    children: React.ReactNode;
}) {

    const securityEnabled = process.env.KEYCLOAK_CLIENT_ID != '';

    return (
        <html lang="en">
        <body className={`${inter.className} antialiased`}>
        {securityEnabled ? <Providers>
            <SessionGuard>
                {children}
            </SessionGuard>
        </Providers> :
            <>
                {children}
            </>
        }
        </body>
</html>
);
}
