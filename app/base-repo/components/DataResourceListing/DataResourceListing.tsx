'use client';

import {DataResource, State} from "@/lib/definitions";
import {fetchDataResources, getAclDiff, patchDataResourceForQuickShare} from "@/lib/base-repo/client_data";
import DataResourceCard from "@/app/base-repo/components/DataResourceCard/DataResourceCard";
import {userCanDownload, userCanEdit, userCanView} from "@/lib/event-utils";
import {FilterForm} from "@/app/base-repo/components/FilterForm/FilterForm.d";
import Pagination from "@/components/general/Pagination";
import React, {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import Loader from "@/components/general/Loader";
import ErrorPage from "@/components/ErrorPage/ErrorPage";
import {Errors} from "@/components/ErrorPage/ErrorPage.d";
import {ViewResourceAction} from "@/lib/actions/base-repo/viewResourceAction";
import {ActionButtonInterface} from "@/app/base-repo/components/DataResourceCard/DataResourceCard.d";
import {EditResourceAction} from "@/lib/actions/base-repo/editResourceAction";
import {DownloadResourceAction} from "@/lib/actions/base-repo/downloadResourceAction";
import {QuickShareResourceAction} from "@/lib/actions/base-repo/quickShareResourceAction";
import {useDebouncedCallback} from "use-debounce";
import {REPO_ACTIONS} from "@/lib/actions/action";
import {runAction} from "@/lib/actions/actionExecutor";
import {QuickShareDialog} from "@/components/dialogs/QuickShareDialog";
import {useRouter} from "next/navigation";

export default function DataResourceListing({page, size, filter, sort}: {
    page: number;
    size: number;
    filter: FilterForm;
    sort: string;
}) {
    const [resources, setResources] = useState(undefined as unknown as DataResource[]);
    const [totalPages, setTotalPages] = useState(0 as number);
    const [isLoading, setIsLoading] = useState(true)
    const [openModal, setOpenModal] = useState(false);
    const [selectedResource, setSelectedResource] = useState({} as DataResource);

    const {data, status} = useSession();
    const router = useRouter();


    const handleAction = useDebouncedCallback((event, resource: DataResource) => {
        const eventIdentifier: string = event.detail.eventIdentifier;
        setSelectedResource(resource);
        if (eventIdentifier.startsWith(REPO_ACTIONS.QUICK_SHARE)) {
            runAction(eventIdentifier, data?.accessToken, doQuickShare);
        } else {
            runAction(eventIdentifier, data?.accessToken, (redirect: string) => {
                router.push(redirect);
            });
        }
    });

    useEffect(() => {
        if (status != "loading") {
            setIsLoading(true);
            fetchDataResources(page, size, filter, sort).then((page) => {
                setTotalPages(page.totalPages);
                setResources(page.resources);
                setIsLoading(false);
            })
        }
    }, [page, size, filter, sort, status])

    if (status === "loading" || isLoading || !resources) {
        return (<Loader/>)
    }

    if (resources.length === 0) {
        return ErrorPage({errorCode: Errors.NotFound, backRef: "/base-repo/resources"})
    }

    function doQuickShare(redirect: string) {
        setOpenModal(true);
    }

    function shareIt(result: boolean, selectedValues?: string[]) {
        setSelectedResource({} as DataResource);
        setOpenModal(false);
        if (!result || !selectedValues) return;

        const aclEntries: string[] = getAclDiff(selectedValues, selectedResource.acls);
        //@TODO error notification if etag is not available
        patchDataResourceForQuickShare(selectedResource.id, selectedResource.etag ? selectedResource.etag : "", aclEntries).finally(() => {
            router.push('/base-repo/resources');
        })
    }

    return (
        <div>
            <div className="rounded-lg p-4 lg:pt-0 lg:w-auto">
                {resources?.map((element: DataResource, i: number) => {
                    //make edit optional depending on permissions
                    const actionEvents: ActionButtonInterface[] = [];

                    if (userCanEdit(element, data?.user.preferred_username, data?.user.groups)) {
                        actionEvents.push(new QuickShareResourceAction(element.id).getDataCardAction());
                    }

                    if (userCanView(element, data?.user.preferred_username, data?.user.groups)) {
                        actionEvents.push(new ViewResourceAction(element.id).getDataCardAction());
                    }

                    if (userCanEdit(element, data?.user.preferred_username, data?.user.groups)) {
                        actionEvents.push(new EditResourceAction(element.id).getDataCardAction());
                    }

                    if (userCanDownload(element, data?.user.preferred_username, data?.user.groups)) {
                        actionEvents.push(new DownloadResourceAction(element.id).getDataCardAction());
                    }

                    let classname = "volatile_or_fixed";
                    switch (element.state) {
                        case State.REVOKED:
                            classname = "revoked";
                            break;
                        case State.GONE:
                            classname = "gone";
                            break;
                    }

                    return (
                        <div key={element.id} className={classname}>
                            <DataResourceCard
                                key={element.id}
                                resource={element}
                                actionEvents={actionEvents}
                                cardCallbackAction={handleAction}
                            ></DataResourceCard>
                        </div>
                    );
                })}
            </div>
            <QuickShareDialog openModal={openModal} resource={selectedResource} closeCallback={shareIt}/>


            <div className="mt-5 flex w-full justify-center">
                {totalPages ?
                    <Pagination totalPages={totalPages}/> : null}
            </div>
        </div>
    );
}
