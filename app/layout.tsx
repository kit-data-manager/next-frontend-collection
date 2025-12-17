import 'react-toastify/dist/ReactToastify.css';
import './globals.css';
import './autocomplete.css';

import {inter} from '@/components/fonts';
import React, {Suspense} from "react";
import {SecurityProviders} from "@/components/Providers/SecurityProviders";
import {ThemeProvider} from "@/components/Providers/ThemeProvider";
import AppHeader from "@/components/AppHeader/AppHeader";
import {cookies} from "next/headers";

export default async function RootLayout({children}: {
    children: React.ReactNode;

}) {
    const securityEnabled = process.env.KEYCLOAK_CLIENT_ID != '' && process.env.KEYCLOAK_CLIENT_ID != undefined;
    const theme = await cookies().then(res => res.get("__theme__")?.value || "system");

    return (
        <html suppressHydrationWarning
              className={theme}
              lang="en"
              style={theme !== "system" ? {colorScheme: theme} : {}}
        >
        <head>
            <title>Next Frontend</title>
        </head>
        <body className={`${inter.className} antialiased`}>
        <script src={"https://cdn.tailwindcss.com/"} async/>
        <script src={"https://cdn.jsdelivr.net/npm/handlebars@latest/dist/handlebars.min.js"} async/>
        <script src={"https://unpkg.com/@trevoreyre/autocomplete-js"} async/>
        <script src={"https://unpkg.com/@trevoreyre/autocomplete-js"} async/>
        <script src={"https://cdn.jsdelivr.net/npm/cleave.js@1.6.0/dist/cleave.min.js"} async/>
        <script src={"https://cdn.jsdelivr.net/npm/@json-editor/json-editor@latest/dist/jsoneditor.min.js"} async/>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"/>
        <link rel="stylesheet"
              href="https://cdn.jsdelivr.net/npm/@json-editor/json-editor@latest/src/themes/html.min.css"/>


        <ThemeProvider  attribute="class"
                        enableSystem
                        disableTransitionOnChange defaultTheme={theme}>
            <SecurityProviders>
                <AppHeader securityEnabled={securityEnabled}>
                    <Suspense fallback={<div>Loading...</div>}>
                        {children}
                    </Suspense>
                </AppHeader>
            </SecurityProviders>

        </ThemeProvider>
        </body>
        </html>
    );
}
