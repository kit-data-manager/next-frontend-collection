import AcmeLogo from '@/app/ui/acme-logo';
import {inter, lusitana} from '@/app/ui/fonts';
import React, {memo, Suspense} from "react";
import {CardsSkeleton} from "@/app/ui/skeletons";
import OverallStatusCardWrapper, {HeaderStatusCardWrapper} from "@/app/ui/dashboard/system-status-cards";
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import "@elastic/react-search-ui-views/lib/styles/styles.css";
import SiteSearch from "@/app/ui/general/site-search";
import {
    ExclamationTriangleIcon, GlobeAltIcon
} from '@heroicons/react/24/outline';
import {Card} from "@/app/ui/general/card";
import Login from "@/app/ui/general/login";
import { Icon } from '@iconify/react';
import {Tooltip} from "flowbite-react";

export default async function Page() {
    let username = "anonymous";
    let session = undefined;
    let authError = false;
    try {
        session = await getServerSession(authOptions);
    } catch (error) {
         authError = true;
    }

    authError = false;

    username = (!authError && session && session.user) ? session.user.name : "Anonymous User";
    const searchEnabled= process.env.SEARCH_BASE_URL != undefined;
    const repoInstanceName= process.env.REPO_INSTANCE_NAME ? process.env.REPO_INSTANCE_NAME : "Data Repository";
    const metastoreInstanceName= process.env.METASTORE_INSTANCE_NAME ? process.env.METASTORE_INSTANCE_NAME : "Metadata Repository";

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
        <main className="flex min-h-screen flex-col p-6">
            <div className="flex h-30 shrink-0 items-end place-content-between rounded-lg bg-blue-500 p-4 md:h-30">
                {<AcmeLogo/>}
                <div className="flex md:flex md:flex-grow flex-row justify-end space-x-1 gap-4">
                    <Tooltip content={repoInstanceName}>
                    <a href="/base-repo"
                       className="py-4 px-2 text-white font-semibold hover:text-sky-300 transition duration-300">
                        <Icon className={"w-12 h-12"} icon="pepicons-pencil:database-circle"></Icon>
                    </a>
                    </Tooltip>
                    <Tooltip content={metastoreInstanceName}>
                    <a href=""
                       className="py-4 px-2 text-white font-semibold hover:text-sky-300 transition duration-300">
                        <Icon className={"w-12 h-12"} icon="pepicons-pencil:menu-circle"></Icon>
                        </a>
                    </Tooltip>
                    {!authError?
                        <Tooltip content="Login">
                            <Login icon={true} style={"py-4 px-2 text-white font-semibold hover:text-sky-300 transition duration-300"}/>
                        </Tooltip>

                        :null}
                </div>
            </div>

            <div className="mt-4 flex grow flex-col gap-4 md:flex-col">
                <div className="flex justify-center gap-6 rounded-lg bg-gray-50 px-6 pt-10 md:h-3/5 md:px-20">
                    <p className={`${inter.className} antialiased text-l text-gray-800 md:text-l md:leading-normal`}>
                        <strong>Welcome {username}.</strong> This is an instance of the{' '}
                        <a href="https://nextjs.org/learn/" className="text-blue-500">
                            Next Frontend Collection
                        </a>
                        , brought to you by FAIR Data Commons.
                    </p>
                </div>
                <h2 className={`${lusitana.className} mb-4 text-l md:text-xl border-b-2 border-sky-200 rounded-sm`}>
                    Status
                </h2>
                 <div className="grid justify-center gap-6 rounded-lg bg-gray-50 px-6 py-0 md:h-1/5 md:px-10 sm:grid-cols-2 lg:grid-cols-4">
                    <Suspense fallback={<CardsSkeleton/>}>
                        <OverallStatusCardWrapper/>
                    </Suspense>
                </div>
                { searchEnabled ?
                    <>
                    <h2 className={`${lusitana.className} mt-4 text-l md:text-xl border-b-2 border-sky-200 rounded-sm`}>
                        Search
                    </h2><SiteSearch/>
                    </> :
                    <div className="flex justify-center gap-6 rounded-lg bg-gray-50 px-6 pt-10 md:h-3/5 md:px-20 grid-cols-3">
                        <ExclamationTriangleIcon className="w-6 h-6 text-red-700"/>
                        <p className={`${inter.className} antialiased text-l text-gray-800 md:text-l md:leading-normal`}>
                            Search is disabled for that instance. Please navigate directly to one of the configures services.
                        </p>
                        <ExclamationTriangleIcon className="w-6 h-6 text-red-700"/>
                    </div>
                }
            </div>

            <div className="flex h-20 shrink-0 items-end rounded-lg bg-blue-500 p-4 md:h-12">
            </div>
        </main>
    );
}
