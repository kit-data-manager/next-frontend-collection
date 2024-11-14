'use client';

import {DataResource, Permission, State} from "@/lib/definitions";
import {fetchDataResourcePages, fetchDataResources, loadContent} from "@/lib/base-repo/client_data";
import DataResourceCard from "@/app/base-repo/components/DataResourceCard/DataResourceCard";
import {
     userCanDownload, userCanEdit, userCanView
} from "@/lib/event-utils";
import {FilterForm} from "@/app/base-repo/components/FilterForm/FilterForm.d";
import Pagination from "@/components/general/Pagination";
import React, {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import Loader from "@/components/general/Loader";
import ErrorPage from "@/components/ErrorPage/ErrorPage";
import {Errors} from "@/components/ErrorPage/ErrorPage.d";
import {ViewResourceAction} from "@/lib/base-repo/actions/viewResourceAction";
import {ActionButtonInterface} from "@/app/base-repo/components/DataResourceCard/DataResourceCard.d";
import {EditResourceAction} from "@/lib/base-repo/actions/editResourceAction";
import {DownloadResourceAction} from "@/lib/base-repo/actions/downloadResourceAction";

export default function DataResourceListing({page,size, filter}: {
    page: number;
    size: number;
    filter: FilterForm;
}) {
    const [resources, setResources] = useState(undefined as unknown as DataResource[]);
    const [totalPages, setTotalPages] = useState(0 as number);
    const [isLoading, setIsLoading] = useState(true)
    const { data, status } = useSession();
    const accessToken = data?.accessToken;

    useEffect(() => {
        if(status != "loading"){
            setIsLoading(true);
            fetchDataResourcePages(size, filter, accessToken).
            then((pages) => setTotalPages(pages ? pages : 0)).
            then(() => fetchDataResources(page, size, filter, accessToken)).
            then(async (result) => {
                const typedRes = result as Array<DataResource>
                let promises: Promise<any>[] = [];
                typedRes.map((element: DataResource) => {
                    promises.push(loadContent(element, accessToken).then((data) => element.children = data));
                });
                await Promise.all(promises);
                setResources(typedRes);
                setIsLoading(false);
            });
        }
    }, [page, size, filter, status, accessToken])

    if (status === "loading" || isLoading || !resources){
        return ( <Loader/> )
    }

    if(resources.length === 0){
        return ErrorPage({errorCode: Errors.NotFound, backRef: "/base-repo/resources"})
    }

    return (
        <div>
            <div className="rounded-lg p-4 lg:pt-0 lg:w-auto">
                    {resources?.map((element:DataResource, i:number) => {
                        //make edit optional depending on permissions
                        const actionEvents:ActionButtonInterface[] = [
                        ];

                        if(userCanView(element, data?.user.id, data?.user.groups)){
                            actionEvents.push(new ViewResourceAction(element.id).getDataCardAction());
                        }

                       if(userCanEdit(element, data?.user.id, data?.user.groups)){
                            actionEvents.push(new EditResourceAction(element.id).getDataCardAction());
                        }

                        if(userCanDownload(element, data?.user.id, data?.user.groups)){
                            actionEvents.push(new DownloadResourceAction(element.id).getDataCardAction());
                        }

                        let classname = "volatile_or_fixed";
                        switch(element.state){
                            case State.REVOKED: classname = "revoked";break;
                            case State.GONE: classname="gone";break;
                        }

                        return (
                            <div key={element.id} className={classname}>
                            <DataResourceCard
                                key={element.id}
                                data={element}
                                actionEvents={actionEvents}
                            ></DataResourceCard>
                            </div>
                        );
                    })}
            </div>


            <div className="mt-5 flex w-full justify-center">
                <Pagination totalPages={totalPages as number}/>
            </div>
        </div>
    );
}
