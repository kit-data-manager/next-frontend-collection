'use client'

import OverallStatusCardWrapper, {BaseRepoStatusCardWrapper} from '@/app/ui/dashboard/cards';
import RevenueChart from '@/app/ui/dashboard/revenue-chart';
import {lusitana} from '@/app/ui/fonts';
import {Suspense} from 'react';
import {RevenueChartSkeleton, LatestInvoicesSkeleton, CardsSkeleton} from '@/app/ui/skeletons';
import SystemStats from "@/app/ui/dashboard/system-stats";
import LatestActivities from "@/app/ui/dashboard/latest-activities";
import {
    PlusCircleIcon
} from '@heroicons/react/24/outline';
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import {DataCard} from "data-card-react";
import {formatDateToLocal} from "@/app/lib/utils";
import Pagination from "@/app/ui/invoices/pagination";

export default async function Page() {
    const resources = [{
        "id": "123445",
        "name": "Test",
        "date": "2024-12-12"
    },
        {
            "id": "1233",
            "name": "Test2",
            "date": "2024-12-12"
        },
        {
            "id": "412223",
            "name": "Test3",
            "date": "2024-12-12"
        },
        {
            "id": "12333",
            "name": "Test4",
            "date": "2024-12-12"
        },
        {
            "id": "1123412",
            "name": "Test5",
            "date": "2024-12-12"
        }];//await fetchFilteredInvoices(query, currentPage);

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    {label: 'base-repo', href: '/base-repo/'},
                    {
                        label: 'Resources List',
                        href: `/base-repo/list`,
                        active: true,
                    },
                ]}
            />
            <div className="mt-6 flow-root">
                <div class="w-full flex justify-end">
                <button className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400 float-end text-center inline-flex items-center">
                    <PlusCircleIcon className="h-5 w-5 me-2"/> Create Resource
                </button>
                </div>
                <div className="block min-w-full">
                    <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
                        {resources.map((resource, i) => {

                            return (<div key={i}>
                                <DataCard
                                    data-title={resource.name}
                                    sub-title={"SubTest"}
                                    variant="default"
                                    image-url={"https://via.placeholder.com/100?text=placeholder"}
                                    body-text={"This is the description"}
                                    textRight={{'label': 'Test', 'value': formatDateToLocal(resource.date)}}
                                    children-data={undefined}
                                    tags={[{"label": "Test", "value": "val"}]}
                                    actionButtons={[{
                                        "label": "edit",
                                        "urlTarget": "_self",
                                        "url": `/base-repo/${resource.id}/edit`
                                    }]}
                                ></DataCard>
                            </div>);
                        })}
                    </div>
                    <div className="mt-5 flex w-full justify-center">
                        <Pagination totalPages={6}/>
                    </div>
                </div>
            </div>
        </main>
    );
}
