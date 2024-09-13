import {inter, lusitana} from '@/components/fonts';
import React, {Suspense} from "react";
import {CardsSkeleton} from "@/components/skeletons";
import OverallStatusCardWrapper from "@/app/base-repo/components/Dashboard/SystemStats";
import {getServerSession} from "next-auth";
import "@elastic/react-search-ui-views/lib/styles/styles.css";
import SiteSearch from "@/components/search/site-search";
import {
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import MainMenu from "@/components/MainMenu/MainMenu";
import SectionCaption from "@/components/SectionCaption/SectionCaption";
import {authOptions} from "@/lib/auth-options";
import AcmeLogo from "@/components/acme-logo";
import {Button} from "@/components/ui/button";
import {ThemeModeToggle} from "@/components/ThemeModeToggle/ThemeModeToggle";
import MainMenuMobile from "@/components/MainMenu/MainMenuMobile";

export default async function Page() {
    let username = "anonymous";
    let session;
    let authError = false;
    try {
        session = await getServerSession(authOptions);
    } catch (error) {
        authError = true;
    }

    authError = false;

    username = (!authError && session && session.user) ? session.user.name : "Anonymous User";
    const searchEnabled = process.env.SEARCH_BASE_URL != undefined;
    const repoInstanceName = process.env.REPO_INSTANCE_NAME ? process.env.REPO_INSTANCE_NAME : "Data Repository";
    const metastoreInstanceName = process.env.METASTORE_INSTANCE_NAME ? process.env.METASTORE_INSTANCE_NAME : "Metadata Repository";

    /*

                    <Link
                        href="/login"
                        className="flex items-center gap-5 self-start rounded-lg bg-blue-500 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-blue-400 md:text-base"
                    >
                        <span>Log in</span> <ArrowRightIcon className="w-5 md:w-6"/>
                    </Link>

                    <Icon icon="pepicons-pencil:key-circle" />
     */

    return (
        <main className="flex min-h-screen flex-col">
            <div className="container mx-auto flex justify-between items-center py-4">
                <div className="flex items-center">
                    <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <AcmeLogo/>
                        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Next Frontend</span>
                    </a>
                </div>

                <div className="flex lg:hidden items-end">
                    <MainMenuMobile authAvailable={!authError}/>
                    <ThemeModeToggle/>
                </div>

                <nav className="hidden lg:flex lg:flex-grow items-center justify-center">
                    <MainMenu authAvailable={!authError}/>
                    <ThemeModeToggle/>
                </nav>

            </div>
            <div className="mt-4 flex grow flex-col gap-4 lg:flex-col">
                <div className="flex justify-center gap-6 rounded-lg px-6 pt-10 md:h-3/5 lg:px-20">
                    <p className={`${inter.className} antialiased text-l lg:text-l lg:leading-normal`}>
                        <strong>Welcome {username}.</strong> This is an instance of the{' '}
                        <a href="https://nextjs.org/learn/" className="text-blue-500">
                            Next Frontend Collection
                        </a>
                        , brought to you by FAIR Data Commons.
                    </p>
                </div>
                <SectionCaption caption={"Status"} level={"h2"}/>
                <div className="grid justify-center gap-6 rounded-lg  px-6 py-0 md:h-1/5 md:px-10 sm:grid-cols-2 lg:grid-cols-4">
                    <Suspense fallback={<CardsSkeleton/>}>
                        <OverallStatusCardWrapper/>
                    </Suspense>
                </div>
                {searchEnabled ?
                    <>
                        <h2 className={`${lusitana.className} mt-4 text-l md:text-xl border-b-2 border-sky-200 rounded-sm`}>
                            Search
                        </h2><SiteSearch/>
                    </> :
                    <div className="flex justify-center gap-6 rounded-lg px-6 pt-10 md:h-3/5 lg:px-20 grid-cols-3">
                        <ExclamationTriangleIcon className="w-6 h-6 text-error"/>
                        <p className={`${inter.className} antialiased text-l md:text-l md:leading-normal`}>
                            Search is disabled for that instance. Please navigate directly to one of the configures
                            services.
                        </p>
                        <ExclamationTriangleIcon className="w-6 h-6 text-error"/>
                    </div>
                }
            </div>

            <div className="flex h-20 shrink-0 items-end rounded-lg bg-secondary p-4 md:h-12">
            </div>
        </main>
    );
}
