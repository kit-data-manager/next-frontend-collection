import React from "react";
import MainMenu from "@/components/MainMenu/MainMenu";


export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen flex-col p-6">
            <MainMenu/>
            <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
        </div>
    );
}
