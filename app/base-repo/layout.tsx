import React from "react";
import MainMenu from "@/components/MainMenu/MainMenu";
import AcmeLogo from "@/components/acme-logo";
import MainMenuMobile from "@/components/MainMenu/MainMenuMobile";
import {ThemeModeToggle} from "@/components/ThemeModeToggle/ThemeModeToggle";
import {getServerSession} from "next-auth";
import {authOptions} from "@/lib/auth-options";


export default async function Layout({ children }: { children: React.ReactNode }) {
    let username = "anonymous";
    let session;
    let authError = false;
    try {
        session = await getServerSession(authOptions);
    } catch (error) {
        authError = true;
    }

    authError = false;
    return (
        <div className="flex min-h-screen flex-col p-6">
            <div className="container mx-auto flex justify-between items-center py-4 sticky bg-primary top-0 z-20">
                <div className="flex items-center">
                    <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <AcmeLogo/>
                        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Next Frontend</span>
                    </a>
                </div>

                <div className="flex lg:hidden items-center gap-2">
                    <MainMenuMobile authAvailable={!authError}/>
                    <ThemeModeToggle/>
                </div>

                <nav className="hidden lg:flex md:flex-grow justify-center p-4 items-center">
                    <MainMenu authAvailable={!authError}/>
                    <ThemeModeToggle/>
                </nav>

            </div>
            <div className="flex-grow p-6 md:overflow-y-auto md:p-12">{children}</div>
        </div>
    );
}
