import '@/app/ui/global.css';
import {inter} from '@/app/ui/fonts';
import Popup from "@/app/ui/general/popup";
import React from "react";
import {Providers} from "@/app/Providers";
import SessionGuard from "@/app/ui/general/SessionGuard";

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body className={`${inter.className} antialiased`}>
        <Providers>
            <SessionGuard>
                {children}
            </SessionGuard>
        </Providers>
        </body>
</html>
)
    ;
}
