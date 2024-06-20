'use client'

import {useState} from 'react';

import {
    PlusCircleIcon
} from '@heroicons/react/24/outline';
import Breadcrumbs from "@/app/ui/invoices/breadcrumbs";
import {DataCard} from "data-card-react";
import Pagination from "@/app/ui/invoices/pagination";
import useSWR from "swr";
import {DataResource} from "@/app/lib/definitions";
import {
    getDescription,
    getSubtitle,
    getTitle,
    getTags,
    getChildren,
    getThumb
} from "@/app/lib/base-repo/datacard-utils";

export default function Page({ searchParams }: {
    searchParams?: {
        query?: string;
        size?: number;
        page?: string;
    };
}) {
    const page = searchParams.page;
    const size =  searchParams.size ?  searchParams.size : 10;
    const [totalPages, setTotalPages] = useState(0);

    const setState = (rangeHeader: string) => {
        if(rangeHeader) {
            let totalElements = rangeHeader.substring(rangeHeader.lastIndexOf("/")+1);
            setTotalPages(Math.ceil(totalElements / size));
        }
    }

    const fetcher = (url:string) => fetch(url).then(function(response){
        setState(response.headers.get("Content-Range"));
        return response.json();
    });

    const { data: resources, isLoading, isError: error, } = useSWR(`http://localhost:8081/api/v1/dataresources/?page=${page-1}&size=${size}`, fetcher);

    if (error) {
        return <p>Failed to fetch</p>;
    }

    if (isLoading) {
        return <p>Loading resources...</p>;
    }

    if (!resources) {
        return <p>Failed to load resources.</p>;
    }

    resources.map((resource, i) => {
        fetch("http://localhost:8081/api/v1/dataresources/" + resource.id + "/data/",
            {headers: {"Accept": "application/vnd.datamanager.content-information+json"}}).then(res => res.json()).then(data => resource["children"] = data);
    });

    function someMethod(event){
        console.log("Here", event.detail.eventIdentifier);
    }

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
                <div className="w-full flex justify-end">
                <button className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400 float-end text-center inline-flex items-center">
                    <PlusCircleIcon className="h-5 w-5 me-2"/> Create Resource
                </button>
                </div>
                <div className="block min-w-full">
                    <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
                        {resources.map((resource:DataResource, i:number) => {
                            return (<div key={i}>
                                    <DataCard
                                        data-title={getTitle(resource)}
                                        sub-title={getSubtitle(resource)}
                                        variant="default"
                                        children-variant="default"
                                        image-url={getThumb(resource)}
                                        body-text={getDescription(resource)}
                                        textRight={{'label': resource.publisher, 'value': resource.publicationYear}}
                                        children-data={getChildren(resource)}
                                        tags={getTags(resource)}
                                        actionButtons={[{
                                            "label": "Edit",
                                            "urlTarget": "_self",
                                            "iconName": "material-symbols-light:edit-square-outline",
                                            "eventIdentifier": "editResource_" + resource.id,
                                        },
                                            {
                                                "label": "Download",
                                                "iconName": "material-symbols-light:download",
                                                "urlTarget": "_blank",
                                                "eventIdentifier": "downloadResource_" + resource.id,
                                            }]}
                                        onActionClick={ev => someMethod(ev)}
                                    ></DataCard>
                                    <hr/>
                                </div>
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
