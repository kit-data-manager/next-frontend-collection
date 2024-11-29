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

    const headerText: string = (process.env.NEXT_PUBLIC_FRONTEND_HEADER_TEXT ? process.env.NEXT_PUBLIC_FRONTEND_HEADER_TEXT : "Next Frontend");
    const headerLogo: string | undefined = (process.env.NEXT_PUBLIC_FRONTEND_HEADER_LOGO ? process.env.NEXT_PUBLIC_FRONTEND_HEADER_LOGO : undefined);
    const basePath: string = (process.env.NEXT_PUBLIC_BASE_PATH ? process.env.NEXT_PUBLIC_BASE_PATH : "/");

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
        <div className={clsx(`flex min-h-screen min-w-[640px] flex-col p-6`, {
            "rounded border-2 border-red-400": admin,
            "rounded border-2 border-sky-500": anonymous})}>
            <div
                className="flex justify-between grid-cols-4 items-center py-4 sticky w-full bg-primary top-0 z-20 rounded-r-lg">
                <div className="flex items-center">
                    <a href={basePath} className="flex items-center space-x-3 rtl:space-x-reverse">
                        <AcmeLogo logoUrl={headerLogo}/>
                        <span className="self-center text-2xl font-semibold whitespace-nowrap">{headerText}</span>
                    </a>
                </div>

                <div className={clsx("flex items-center p-2")}>
                <nav className="hidden w-full lg:grid grid-cols-2 p-4 items-center mr-2">
                    <div className="flex justify-self-stretch">
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
                <div className="flex lg:hidden items-center gap-2 mr-6">
                    <MainMenuMobile/>
                    {securityEnabled ?
                        <LoginLogoutButton icon={true}/> : null
                    }
                    <ThemeModeToggle className="justify-self-end"/>
                </div>
            </div>
            {children}
        </div>
    );
}
