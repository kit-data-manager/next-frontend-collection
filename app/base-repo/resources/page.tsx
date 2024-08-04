import {
    PlusCircleIcon
} from '@heroicons/react/24/outline';
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import Link from "next/link";
import DataResourceListing from "@/app/base-repo/components/DataResourceListing/DataResourceListing";
import DataResourceListingSkeleton from "@/app/base-repo/components/DataResourceListing/DataResourceListingSkeleton";
import {Suspense} from 'react';
import FilterResourceForm from "@/app/base-repo/components/FilterForm/FilterForm";
import {FilterForm} from "@/app/base-repo/components/FilterForm/FilterForm.d";
import {DataResourcesSearchParams} from "@/lib/definitions";
import {valueOrDefault} from "@/lib/searchParamHelper";


export default async function Page({searchParams}: {
    searchParams?: DataResourcesSearchParams;
}) {

    const page: number = valueOrDefault(searchParams, "page", 0);
    const size:number = valueOrDefault(searchParams, "size", 10);
    const filter:FilterForm = {} as FilterForm;

    filter.id = valueOrDefault(searchParams, "id", undefined);
    filter.state = valueOrDefault(searchParams, "state", undefined);
    filter.publisher = valueOrDefault(searchParams, "publisher", undefined);
    filter.publicationYear = valueOrDefault(searchParams, "publicationYear", undefined);

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    {label: 'Overview', href: '/base-repo'},
                    {
                        label: 'Resources',
                        href: `/base-repo/resources`,
                        active: true,
                    },
                ]}
            />
            <div className="mt-6 flow-root">
                    <div className="flex justify-end gap-2">
                    <Link
                        className="mt-4 rounded-md px-4 py-2 mb-6 text-sm transition-colors hover:underline float-end text-center inline-flex items-center"
                        href='/base-repo/resources/create'>
                        <PlusCircleIcon className="h-5 w-5 me-2"/> Create Resource
                    </Link>
                    </div>
                <div className="w-full flex col-2">

                    <div className="w-full">
                        <Suspense fallback={<DataResourceListingSkeleton count={3}/>}>
                            <DataResourceListing page={page} size={size} filter={filter}/>
                        </Suspense>
                    </div>
                    <div className="w-75 rounded-lg border items-center justify-between p-2">
                        <FilterResourceForm filter={filter}/>
                    </div>
                </div>
            </div>
        </main>
    );
}
