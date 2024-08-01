import Link from 'next/link';
import AcmeLogo from '@/components/acme-logo';
import {PowerIcon} from '@heroicons/react/24/outline';
import Login from "@/components/general/login";
import {getServerSession} from "next-auth";
import {authOptions} from "@/app/api/auth/[...nextauth]/route";
import Logout from "@/components/general/logout";
import React from "react";

export default async function SideNavDataResources({children}: {
    children: React.ReactNode;
}) {
    let session = undefined;
    let authError = false;
    try {
        session = await getServerSession(authOptions)
    } catch (error) {
        authError = true;
    }
    return (
        <div className="flex h-full flex-col px-3 py-4 md:px-2">
            <Link
                className="mb-2 flex h-20 items-end justify-start rounded-md bg-blue-600 p-4 md:h-40"
                href="/"
            >
                <div className="w-32 text-white md:w-40">
                    <AcmeLogo/>
                </div>
            </Link>
            <div className="flex grow flex-row justify-between space-x-2 md:flex-col md:space-x-0 md:space-y-2">
                {children}
                <div className="h-auto w-full grow rounded-md bg-gray-50 md:block"></div>
                {!authError ? (
                    <div
                        className="flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3">
                        {session && session.user ? (
                            <>
                                <PowerIcon className="w-6 text-[#56EB56]"/>
                                <Logout/>
                            </>
                        ) : (
                            <>
                                <PowerIcon className="w-6 text-[#FC736E]"/>
                                <Login/>
                            </>
                        )
                        }
                    </div>
                ) : null}
            </div>
        </div>
    );
}
