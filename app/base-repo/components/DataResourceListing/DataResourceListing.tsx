'use client';

import {DataResource, Permission} from "@/lib/definitions";
import {fetchDataResourcePages, fetchDataResources, loadContent} from "@/lib/base-repo/client_data";
import DataResourceCard from "@/app/base-repo/components/DataResourceCard/DataResourceCard";
import {notFound} from "next/navigation";
import {downloadEventIdentifier, editEventIdentifier, viewEventIdentifier} from "@/lib/event-utils";
import {FilterForm} from "@/app/base-repo/components/FilterForm/FilterForm.d";
import Pagination from "@/components/general/Pagination";
import React, {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import {resourcePermissionForUser} from "@/lib/base-repo/client-utils";
import {Blocks} from "react-loader-spinner";

export default function DataResourceListing({page,size, filter}: {
    page: number;
    size: number;
    filter: FilterForm;
}) {
    const [resources, setResources] = useState([] as Array<DataResource>)
    const [totalPages, setTotalPages] = useState(0 as number);
    const [isLoading, setLoading] = useState(true)
    const { data, status } = useSession();

    useEffect(() => {
        fetchDataResourcePages(size).
        then((pages) => setTotalPages(pages ? pages : 0)).
        then(() => fetchDataResources(page, size, filter)).
        then(async (result) => {
            const typedRes = result as Array<DataResource>
            let promises: Promise<any>[] = [];
            typedRes.map((element: DataResource) => {
                promises.push(loadContent(element).then((data) => element.children = data));
            });
            await Promise.all(promises);
            return setResources(typedRes);
        }).finally(() => setLoading(false));
    }, [page, size, filter])

    if (true) return (
        <Blocks
            height="80"
            width="80"
            color="accent"
            ariaLabel="blocks-loading"
            wrapperStyle={{}}
            wrapperClass="blocks-wrapper"
            visible={true}
        />
    )

    if(!resources || resources.length === 0){
        notFound();
    }

    return (
        <div>
            <div className="rounded-lg p-2 lg:pt-0 lg:w-auto">
                    {resources.map((element:DataResource, i:number) => {
                        //make edit optional depending on permissions

                        const actionEvents = [
                            viewEventIdentifier(element.id)
                        ];

                        let permission:Permission = resourcePermissionForUser(element, data?.user.id);
                        if(permission.valueOf() > Permission.READ.valueOf()){
                            actionEvents.push(editEventIdentifier(element.id));
                        }

                        actionEvents.push(downloadEventIdentifier(element.id));
                        return (
                            <DataResourceCard
                                key={element.id}
                                data={element}
                                actionEvents={actionEvents}
                            ></DataResourceCard>
                        );
                    })}
            </div>


            <div className="mt-5 flex w-full justify-center">
                <Pagination totalPages={totalPages as number}/>
            </div>
        </div>
    );
}
