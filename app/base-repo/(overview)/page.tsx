import {lusitana} from '@/components/fonts';
import {CardsSkeleton} from '@/components/skeletons';
import RepositoryStats from "@/app/base-repo/components/Dashboard/RepositoryStats";
import LatestActivities from "@/app/base-repo/components/Dashboard/LatestActivities";
import {Suspense} from 'react';
import {BaseRepoStatusCardWrapper} from "@/app/base-repo/components/Dashboard/SystemStats";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import LatestActivitiesSkeleton from "@/app/base-repo/components/Dashboard/LatestActivitiesSkeleton";
import * as React from "react";
import RepositoryStatsSkeleton from "@/app/base-repo/components/Dashboard/RepositoryStatsSkeleton";

export default async function Page() {
    const repoInstanceName = process.env.REPO_INSTANCE_NAME ? process.env.REPO_INSTANCE_NAME : "Data Repository";

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    {label: `${repoInstanceName}`, href: '/base-repo', active: true},
                ]}
            />
            <h2 className={`${lusitana.className} mb-4 text-l md:text-xl border-b-2 border-sky-200 rounded-sm`}>
                Sub-System Status
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <Suspense fallback={<CardsSkeleton/>}>
                    <BaseRepoStatusCardWrapper/>
                </Suspense>
            </div>

            <div className="grid gap-6 mt-6 sm:grid-cols-2 lg:grid-cols-2">
                <div className="flex w-full flex-col">
                    <h2 className={`${lusitana.className} mb-4 text-l md:text-xl border-b-2 border-sky-200 rounded-sm`}>
                        Content Overview
                    </h2>
                    <div className="grid grid-cols-2 gap-4 px-4 py-8">
                        <Suspense fallback={<RepositoryStatsSkeleton/>}>
                            <RepositoryStats/>
                        </Suspense>
                    </div>
                </div>

                <div className="flex w-full flex-col">
                    <h2 className={`${lusitana.className} mb-4 text-l md:text-xl border-b-2 border-sky-200 rounded-sm`}>
                        Latest Activities
                    </h2>
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
