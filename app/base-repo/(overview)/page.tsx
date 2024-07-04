import { lusitana } from '@/app/ui/fonts';
import {CardsSkeleton } from '@/app/ui/skeletons';
import DataRepositoryStats from "@/app/ui/dashboard/data-repository-stats";
import LatestActivities from "@/app/ui/dashboard/latest-activities";
import Breadcrumbs from "@/app/ui/general/breadcrumbs";
import { Suspense } from 'react';
import {BaseRepoStatusCardWrapper} from "@/app/ui/dashboard/system-status-cards";

export default async function Page() {

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'base-repo', href: '/base-repo', active: true},
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
