"use client";

import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import {DataResourcesSearchParamsPromise} from "@/lib/definitions";
import SectionCaption from "@/components/SectionCaption/SectionCaption";
import {ToastContainer} from "react-toastify";
import React from "react";
import {MappingListing} from "@/app/mapping/components/MappingListing/MappingListing";
import Loader from "@/components/general/Loader";
import ErrorPage from "@/components/ErrorPage/ErrorPage";
import {Errors} from "@/components/ErrorPage/ErrorPage.d";
import {useSession} from "next-auth/react";

export default function Page({searchParams}: {
    searchParams?: DataResourcesSearchParamsPromise;
}) {
    const {status} = useSession();

    if (status === "loading") {
        return (<Loader/>)
    }

    if(status === "unauthenticated"){
        return ErrorPage({errorCode: Errors.Forbidden, backRef: "/mapping"})
    }

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    {label: 'Overview', href: '/mapping'},
                    {
                        label: 'Execute Mappings',
                        href: `/mapping/map`,
                        active: true,
                    },
                ]}
            />
            <SectionCaption caption={"Execute Mappings"}/>
            <div className="flex w-full">
                    <MappingListing/>
            </div>
            <ToastContainer/>

        </main>
    );
}



