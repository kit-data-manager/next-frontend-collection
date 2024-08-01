import SideNavDataResources from "@/components/Nav/SideNav";
import React from "react";
import '../global.css';
import NavLinksDataResources from "@/app/base-repo/components/Nav/NavLinksDataResources";


export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
            <div className="w-full flex-none md:w-64">
                <SideNavDataResources>
                    <NavLinksDataResources/>
                </SideNavDataResources>
            </div>
            <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
        </div>
    );
}
