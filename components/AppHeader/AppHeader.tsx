"use client";

import AcmeLogo from "@/components/acme-logo";
import MainMenuMobile from "@/components/MainMenu/MainMenuMobile";
import {ThemeModeToggle} from "@/components/ThemeModeToggle/ThemeModeToggle";
import MainMenu from "@/components/MainMenu/MainMenu";
import React, {useEffect, useState} from "react";
import LoginLogoutButton from "@/components/general/LoginLogoutButton";
import {useSession} from "next-auth/react";
import {clsx} from "clsx";

export default function AppHeader({securityEnabled, children}: {
    securityEnabled: boolean;
    children: React.ReactNode;
}) {

    const {data, status} = useSession();
    const [admin, setAdmin] = useState(false);
    const [anonymous, setAnonymous] = useState(false);

    useEffect(() => {
        if(data && data.user && data.user.groups){
            setAdmin(data.user.groups.includes("ROLE_ADMINISTRATOR"));
            setAnonymous(false);
        }else{
            setAdmin(false);
            setAnonymous(true);
        }
    }, [status, data]);

    return (
        <div className={clsx(`flex min-h-screen flex-col p-6`, {
            "rounded border-2 border-red-400": admin,
            "rounded border-2 border-sky-500": anonymous})}>
            <div className="flex justify-between grid-cols-3 items-center py-4 sticky w-full bg-primary top-0 z-20">
                <div className="flex items-center grid-cols-1">
                    <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <AcmeLogo/>
                        <span className="self-center text-2xl font-semibold whitespace-nowrap">Next Frontend for MatWerk</span>
                    </a>
                </div>

                <div className="flex lg:hidden items-center gap-2 mr-6">
                    <MainMenuMobile/>
                    {securityEnabled ?
                        <LoginLogoutButton icon={true}/> : null
                    }
                    <ThemeModeToggle className="justify-self-end"/>
                </div>

                <nav className="hidden w-full lg:grid grid-cols-2 p-4 items-center mr-2">
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
