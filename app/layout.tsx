import './global.css';
import {inter} from '@/components/fonts';
import React from "react";
import {Providers} from "@/app/Providers";
import SessionGuard from "@/components/general/SessionGuard";
import {ThemeProvider} from "@/components/Providers/theme-provider";

import { ThemeModeScript } from "flowbite-react";


export default function RootLayout({children}: {
    children: React.ReactNode;
}) {

    const securityEnabled = process.env.KEYCLOAK_CLIENT_ID != '';
    return (
        <html lang="en">
        <head className={"dark"}>
            <ThemeModeScript />
        </head>
        <body className={`${inter.className} antialiased bg-primary text-primary-foreground`}>
        <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
        >
        {securityEnabled ? <Providers>
                <SessionGuard>
                    {children}
                </SessionGuard>
            </Providers> :
            <>
                {children}
            </>
        }
        </ThemeProvider>
        </body>
        </html>
    );
}
