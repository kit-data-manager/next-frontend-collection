import {CardsSkeleton} from '@/components/skeletons';
import LatestActivities from "@/app/base-repo/components/Dashboard/LatestActivities";
import * as React from 'react';
import {Suspense} from 'react';
import {ActuatorHealthStatusCardWrapper} from "@/components/SystemStats/SystemStats";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import LatestActivitiesSkeleton from "@/app/base-repo/components/Dashboard/LatestActivitiesSkeleton";
import RepositoryStatsSkeleton from "@/app/base-repo/components/Dashboard/RepositoryStatsSkeleton";
import SectionCaption from "@/components/SectionCaption/SectionCaption";
import MetastoreStats from "@/app/metastore/components/Dashboard/MetastoreStats";

export default async function Page() {
    const repoBaseUrl: string = process.env.NEXT_PUBLIC_METASTORE_BASE_URL ? process.env.NEXT_PUBLIC_METASTORE_BASE_URL : '';

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    {label: "Overview", href: '/metastore', active: true},
                ]}
            />
            <SectionCaption caption={"Overview"}/>

            <div className="grid gap-6 mt-6 sm:grid-cols-2 lg:grid-cols-2">
                <div className="flex w-full flex-col">
                    <SectionCaption caption={"Usage Statistics"} level={"h2"}/>

                    <div className="grid grid-cols-2 gap-4 px-4 py-8">
                        <Suspense fallback={<RepositoryStatsSkeleton/>}>
                            <MetastoreStats/>
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
