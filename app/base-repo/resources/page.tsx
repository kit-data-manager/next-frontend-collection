import {
    PlusCircleIcon
} from '@heroicons/react/24/outline';
import Breadcrumbs from "@/app/ui/general/breadcrumbs";
import Link from "next/link";
import {InvoicesTableSkeleton, ListingSkeleton} from "@/app/ui/skeletons";
import {Suspense} from 'react';
import DataResourceListing from "@/app/ui/dataresources/data-resource-listing";
import {Button} from "@/app/ui/button";


export default async function Page({searchParams}: {
    searchParams?: {
        query?: string;
        size?: number;
        page?: string;
    };
}) {
    const page: Number = searchParams.page ? Number.parseInt(searchParams.page) : 1;
    const size = searchParams.size ? Number.parseInt(searchParams.size) : 10;

    /*
        let resources = [{
            id: "test",
            titles:[{value:"test"}],
            acls:[{sid:"SELF", permission:"READ"}],
            publisher:"jejkal",
            publicationYear: 2024
        }]*/


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
                <div className="w-full flex justify-end">
                    <Link
                        className="mt-4 rounded-md bg-blue-500 px-4 py-2 mb-6 text-sm text-white transition-colors hover:bg-blue-400 float-end text-center inline-flex items-center"
                        href='/base-repo/resources/create'>
                        <PlusCircleIcon className="h-5 w-5 me-2"/> Create Resource
                    </Link>
                </div>
                <Suspense key={"test"} fallback={<ListingSkeleton/>}>
                    <DataResourceListing page={page} size={size}/>
                </Suspense>
            </div>
        </main>
    );
}
