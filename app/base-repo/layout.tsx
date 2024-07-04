import SideNavDataResources from "@/app/ui/dataresources/data-resource-side-nav";
import React from "react";
import Popup from "@/app/ui/general/popup";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex h-screen flex-col md:flex-row md:overflow-hidden">
            <div className="w-full flex-none md:w-64">
                <SideNavDataResources />
            </div>
            <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
        </div>
    );
}
