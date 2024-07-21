import {
    PencilIcon,
    PlusCircleIcon
} from '@heroicons/react/24/outline';
import Breadcrumbs from "@/app/ui/general/breadcrumbs";
import Link from "next/link";
import DataResourceListing from "@/app/ui/dataresources/data-resource-listing";
import MyLoader from "@/app/ui/dataresources/MyLoader";
import {Suspense} from 'react';
import EditInvoiceForm from "@/app/ui/invoices/edit-form";
import {CustomerField, FilterForm, InvoiceForm} from "@/app/lib/definitions";
import FilterResourceForm from "@/app/ui/dataresources/filter-form";


export default async function Page({searchParams}: {
    searchParams?: {
        query?: string;
        size?: number;
        page?: string;
        id?:string;
        state?:string;
        publicationYear?:string;
        publisher?:string;
    };
}) {
    const page: Number = searchParams.page ? Number.parseInt(searchParams.page) : 1;
    const size = searchParams.size ? Number.parseInt(searchParams.size) : 10;
    const filter:FilterForm = {} as FilterForm;

    searchParams.id ? filter.id = searchParams.id : undefined;
    searchParams.state ? filter.state = searchParams.state : undefined;
    searchParams.publisher ? filter.publisher = searchParams.publisher : undefined;
    searchParams.publicationYear ? filter.publicationYear = searchParams.publicationYear : undefined;

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
                        className="mt-4 rounded-md bg-blue-500 px-4 py-2 mb-6 text-sm text-white transition-colors hover:bg-blue-400 float-end text-center inline-flex items-center"
                        href='/base-repo/resources/create'>
                        <PlusCircleIcon className="h-5 w-5 me-2"/> Create Resource
                    </Link>
                    </div>
                <div className="w-full flex col-2">
                 <div className="w-75 bg-gray-50 rounded-lg border items-center justify-between p-2">
                      <FilterResourceForm filter={filter}/>
                 </div>
                    <div className="w-full">
                <Suspense fallback={<MyLoader count={3} />}>
                    <DataResourceListing page={page} size={size} filter={filter}/>
                </Suspense>
                    </div>
                </div>
            </div>
        </main>
    );
}
