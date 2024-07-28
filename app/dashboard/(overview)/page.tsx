import LatestActivities from '@/components/dashboard/latest-activities';
import { lusitana } from '@/components/fonts';
import { Suspense } from 'react';
import { RevenueChartSkeleton, LatestInvoicesSkeleton, CardsSkeleton } from '@/components/skeletons';
import OverallStatusCardWrapper from "@/components/dashboard/system-status-cards";
import RevenueChart from "@/components/general/revenue-chart";

export default async function Page() {

    return (
        <main>
            <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
                Dashboard
            </h1>
            {/**Badges*/}
            <h2 className={`${lusitana.className} mb-4 text-l md:text-xl border-b-2 border-sky-200 rounded-sm`}>
                Service Status
            </h2>
            <div className="grid gap-6 sm:grid-cols-3 lg:grid-cols-3 ">
                <Suspense fallback={<CardsSkeleton />}>
                    <OverallStatusCardWrapper />
                </Suspense>
            </div>
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-8">
                <Suspense fallback={<RevenueChartSkeleton />}>
                    <RevenueChart />
                </Suspense>
                <Suspense fallback={< LatestInvoicesSkeleton />}>
                     <LatestActivities/>
                </Suspense>
            </div>
        </main>
    );
}
