import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import Popup from "@/app/ui/general/popup";
import React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
      {children}
      <Popup/>
      </body>
    </html>
  );
}
