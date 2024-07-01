//'use client'
import {useState} from 'react';

import {
    PlusCircleIcon
} from '@heroicons/react/24/outline';
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import Pagination from "@/app/ui/invoices/pagination";
import useSWR from "swr";
import {DataResource} from "@/app/lib/definitions";
import {
    getDescription,
    getSubtitle,
    getTitle,
    getTags,
    getThumb
} from "@/app/lib/base-repo/datacard-utils";
import {redirect, useRouter} from "next/navigation";
import {useDebouncedCallback } from 'use-debounce';
import {eventIdentifierToPath} from "@/app/lib/utils";
import {DataCard} from "data-card-react";
import NextDataCard from "@/app/ui/general/datacard";
import {fetchDataResourcePages, fetchDataResources} from "@/app/lib/base-repo/data";
import {revalidatePath} from "next/cache";
import Link from "next/link";

export default async function Page({ searchParams }: {
    searchParams?: {
        query?: string;
        size?: number;
        page?: string;
    };
}) {
    const page = searchParams.page ?  searchParams.page : 1;
    const size =  searchParams.size ?  searchParams.size : 10;
   // const [totalPages, setTotalPages] = useState(0);
   // const { replace } = useRouter();
//let totalPages = 1;
    /*const handleAction = useDebouncedCallback((event) => {
        const eventIdentifier:string = event.detail.eventIdentifier;
        replace(eventIdentifierToPath(eventIdentifier));
    });*/

    /*const setState = (rangeHeader: string) => {
        if(rangeHeader) {
            let totalElements = rangeHeader.substring(rangeHeader.lastIndexOf("/")+1);
            totalPages = Math.ceil(totalElements / size);
        }
    }*/

   /* const fetcher = (url:string) => fetch(url).then(function(response){
        setState(response.headers.get("Content-Range"));
        return response.json();
    });*/

    function confirmCreateResource() {
        redirect('/base-repo/resources/create');
    }
/*
    let resources = [{
        id: "test",
        titles:[{value:"test"}],
        acls:[{sid:"SELF", permission:"READ"}],
        publisher:"jejkal",
        publicationYear: 2024
    }]*/

    const resources = await fetchDataResources(page, size);
    const totalPages = await fetchDataResourcePages(size);
    console.log(totalPages);

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
                <Link className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400 float-end text-center inline-flex items-center"
                       href='/base-repo/resources/create'>
                    <PlusCircleIcon className="h-5 w-5 me-2"/> Create Resource
                </Link>
                </div>
                <div className="block min-w-full">
                    <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
                        {resources.map((resource:DataResource, i:number) => {
                            return (
                                <NextDataCard key={i} id={resource.id} titles={resource.titles} creators={resource.creators} publisher={resource.publisher} publicationYear={resource.publicationYear}
                                                  descriptions={resource.descriptions} acls={resource.acls} rights={resource.rights} embargoDate={resource.embargoDate} state={resource.state}/>

                            );
                        })}
                    </div>
                    <div className="mt-5 flex w-full justify-center">
                    <Pagination totalPages={totalPages}/>
                    </div>
                </div>
            </div>
        </main>
    );
}
