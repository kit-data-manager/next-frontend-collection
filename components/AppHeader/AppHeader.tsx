"use client";

import AcmeLogo from "@/components/acme-logo";
import MainMenuMobile from "@/components/MainMenu/MainMenuMobile";
import {ThemeModeToggle} from "@/components/ThemeModeToggle/ThemeModeToggle";
import MainMenu from "@/components/MainMenu/MainMenu";
import React from "react";
import LoginLogoutButton from "@/components/general/LoginLogoutButton";
import {useSession} from "next-auth/react";

export default function AppHeader({securityEnabled, children}: {
    securityEnabled: boolean;
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen flex-col p-6">
            <div className="flex justify-between grid-cols-3 items-center py-4 sticky w-full bg-primary top-0 z-20">
                <div className="flex items-center grid-cols-1">
                    <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <AcmeLogo/>
                        <span className="self-center text-2xl font-semibold whitespace-nowrap">Next Frontend for MatWerk</span>
                    </a>
                </div>

                <div className="flex lg:hidden items-center gap-2 mr-2">
                    <MainMenuMobile/>
                    {securityEnabled ?
                        <LoginLogoutButton icon={true} className="mr-4"/> : null
                    }
                    <ThemeModeToggle className="justify-self-end"/>
                </div>

                <nav className="hidden lg:grid grid-cols-2 p-4 items-center mr-2">
                    <div className="flex justify-self-stretch" >
                    <MainMenu/>
                    </div>
                    <div className="flex justify-self-end">
                        {securityEnabled ?
                        <LoginLogoutButton icon={true} className="mr-4"/> : null
                        }
                        <ThemeModeToggle className="justify-self-end"/>
                    </div>
                </nav>

            </div>
            {children}
        </div>
    );
}
