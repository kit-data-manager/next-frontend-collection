import {CardsSkeleton} from '@/components/skeletons';
import RepositoryStats from "@/app/base-repo/components/Dashboard/RepositoryStats";
import LatestActivities from "@/app/base-repo/components/Dashboard/LatestActivities";
import {Suspense} from 'react';
import {ActuatorHealthStatusCardWrapper} from "@/components/SystemStats/SystemStats";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import LatestActivitiesSkeleton from "@/app/base-repo/components/Dashboard/LatestActivitiesSkeleton";
import * as React from "react";
import RepositoryStatsSkeleton from "@/app/base-repo/components/Dashboard/RepositoryStatsSkeleton";
import SectionCaption from "@/components/SectionCaption/SectionCaption";
import MappingServiceStats from "@/app/mapping/components/Dashboard/MappingServiceStats";
import MappingServiceStatsSkeleton from "@/app/mapping/components/Dashboard/MappingServiceStatsSkeleton";

export default async function Page() {
    const mappingBaseUrl: string = process.env.NEXT_PUBLIC_MAPPING_BASE_URL ? process.env.NEXT_PUBLIC_MAPPING_BASE_URL : '';
    console.log("INFO FOR " , mappingBaseUrl);
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    {label: "Overview", href: '/mapping', active: true},
                ]}
            />
            <SectionCaption caption={"Overview"}/>

            <SectionCaption caption={"Sub-System Status"} level={"h2"}/>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <Suspense fallback={<CardsSkeleton/>}>
                    <ActuatorHealthStatusCardWrapper serviceUrl={mappingBaseUrl}/>
                </Suspense>
            </div>

            <div className="grid gap-6 mt-6 sm:grid-cols-2 lg:grid-cols-2">
                <div className="flex w-full flex-col">
                    <SectionCaption caption={"Content Overview"} level={"h2"}/>

                    <div className="grid grid-cols-2 gap-4 px-4 py-8">
                        <Suspense fallback={<MappingServiceStatsSkeleton/>}>
                            <MappingServiceStats/>
                        </Suspense>
                    </div>
                </div>

                <div className="flex w-full flex-col">
                    <SectionCaption caption={"Latest Activities"} level={"h2"}/>

                    <div className="flex gap-4 px-4 py-8 grow flex-col justify-between rounded-xl ">
                        <Suspense fallback={<LatestActivitiesSkeleton/>}>
                            <LatestActivities/>
                        </Suspense>
                    </div>
                </div>
            </div>
        </main>
    );
}
