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
import SectionCaption from "@/components/SectionCaption/SectionCaption";


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
            <SectionCaption caption={"Resources"}/>

            <div >
                <div className="flex">
                    <div className="hidden lg:inline lg:flex-none rounded-lg border items-center justify-between p-4 lg:p-6">
                            <Link
                                className="rounded-md px-4 bg-accent text-accent-foreground py-2 text-sm hover:underline inline-flex items-center w-full mb-4"
                                href='/base-repo/resources/create'>
                                <PlusCircleIcon className="h-5 w-5 me-2"/> Create Resource
                            </Link>
                        <FilterResourceForm filter={filter}/>
                    </div>
                    <div className="lg:initial w-full lg:w-2/3 ">
                        <Suspense fallback={<DataResourceListingSkeleton count={3}/>}>
                            <DataResourceListing page={page} size={size} filter={filter}/>
                        </Suspense>
                    </div>
                </div>
            </div>
        </main>
    );
}
