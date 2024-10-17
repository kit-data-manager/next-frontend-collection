import './global.css';
import {inter} from '@/components/fonts';
import React from "react";
import {SecurityProviders} from "@/components/Providers/SecurityProviders";
import {ThemeProvider} from "@/components/Providers/ThemeProvider";
import AppHeader from "@/app/base-repo/components/AppHeader/AppHeader";

export default async function RootLayout({children}: {
    children: React.ReactNode;
}) {
    const securityEnabled = process.env.KEYCLOAK_CLIENT_ID != '' && process.env.KEYCLOAK_CLIENT_ID != undefined;

    return (
        <html lang="en">
        <head className={"dark"}>
            <title>Next Frontend</title>
        </head>
        <body className={`${inter.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <SecurityProviders>
                <AppHeader securityEnabled={securityEnabled}>
                    {children}
                </AppHeader>
            </SecurityProviders>
        </ThemeProvider>
        </body>
        </html>
    );
}
