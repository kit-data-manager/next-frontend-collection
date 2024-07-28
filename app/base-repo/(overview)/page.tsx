import { lusitana } from '@/components/fonts';
import {CardsSkeleton } from '@/components/skeletons';
import DataRepositoryStats from "@/components/dashboard/data-repository-stats";
import LatestActivities from "@/components/dashboard/latest-activities";
import Breadcrumbs from "@/components/Breadcrumbs/breadcrumbs";
import { Suspense } from 'react';
import {BaseRepoStatusCardWrapper} from "@/components/dashboard/system-status-cards";

export default async function Page() {
    const repoInstanceName= process.env.REPO_INSTANCE_NAME ? process.env.REPO_INSTANCE_NAME : "Data Repository";

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: `${repoInstanceName}`, href: '/base-repo', active: true},
                ]}
            />
            {/**Badges*/}
            <h2 className={`${lusitana.className} mb-4 text-l md:text-xl border-b-2 border-sky-200 rounded-sm`}>
                Sub-System Status
            </h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                <Suspense fallback={<CardsSkeleton />}>
                    <BaseRepoStatusCardWrapper />
                </Suspense>
            </div>

            <div className="grid gap-6 mt-6 sm:grid-cols-2 lg:grid-cols-2">
                <div><DataRepositoryStats/></div>
                <div><LatestActivities/></div>
            </div>
        </main>
    );
}
