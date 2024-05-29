import OverallStatusCardWrapper, {BaseRepoStatusCardWrapper} from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';
import { RevenueChartSkeleton, LatestInvoicesSkeleton, CardsSkeleton } from '@/app/ui/skeletons';
import SystemStats from "@/app/ui/dashboard/system-stats";
import LatestActivities from "@/app/ui/dashboard/latest-activities";
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";

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
                <div><SystemStats/></div>
                <div><LatestActivities/></div>
            </div>
        </main>
    );
}
