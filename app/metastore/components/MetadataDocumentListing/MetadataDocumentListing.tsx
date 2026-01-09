'use client';

import {DataResource, Permission, State} from "@/lib/definitions";
import {userCanDownload, userCanEdit, userCanView} from "@/lib/event-utils";
import Pagination from "@/components/general/Pagination";
import React, {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import Loader from "@/components/general/Loader";
import ErrorPage from "@/components/ErrorPage/ErrorPage";
import {Errors} from "@/components/ErrorPage/ErrorPage.d";
import {ActionButtonInterface} from "@/app/base-repo/components/DataResourceCard/DataResourceCard.d";
import {QuickShareDialog} from "@/components/dialogs/QuickShareDialog";
import {useDebouncedCallback} from "use-debounce";
import {METASTORE_ACTIONS} from "@/lib/actions/action";
import {runAction} from "@/lib/actions/action-executor";
import {useRouter} from "next/navigation";
import {getAclDiff} from "@/lib/base-repo/client-data";
import {toast} from "react-toastify";
import MetadataDocumentCard from "@/app/metastore/components/MetadataDocumentCard/MetadataDocumentCard";
import {fetchMetadataRecords, updateMetadataRecord} from "@/lib/metastore/client-data";
import {QuickShareMetadataDocumentAction} from "@/lib/actions/metastore/quickShareMetadataDocumentAction";
import {ViewMetadataDocumentAction} from "@/lib/actions/metastore/viewMetadataDocumentAction";
import {EditMetadataDocumentAction} from "@/lib/actions/metastore/editMetadataDocumentAction";
import {DownloadMetadataDocumentAction} from "@/lib/actions/metastore/downloadMetadataDocumentAction";

export default function MetadataDocumentListing({page, size, sort}: {
    page: number;
    size: number;
    sort: string;
}) {
    const [resources, setResources] = useState(undefined as unknown as DataResource[]);
    const [totalPages, setTotalPages] = useState(0 as number);
    const [isLoading, setIsLoading] = useState(true)
    const {data, status} = useSession();
    const [openModal, setOpenModal] = useState(false);
    const [selectedResource, setSelectedResource] = useState({} as DataResource);
    const router = useRouter();
    const [mustReload, setMustReload] = useState(false);

    const handleAction = useDebouncedCallback((event, resource) => {
        const eventIdentifier: string = event.detail.eventIdentifier;

        setSelectedResource(resource);

        if (eventIdentifier.startsWith(METASTORE_ACTIONS.QUICK_SHARE_METADATA)) {
            runAction(eventIdentifier, data?.accessToken, doQuickShare);
        } else {
            runAction(eventIdentifier, data?.accessToken, (redirect: string) => {
                router.push(redirect);
            });
        }

    });

    /**
     * Effect that loads all schemas of the current page, sets the pagination information, and the resources.
     * The effect will run each time pagination information is changed (page, size, sort), if authorization information
     * changes, or if a reload is triggered via 'mustReload'
     */
    useEffect(() => {
        if (status != "loading") {
            setIsLoading(true);
            fetchMetadataRecords("document", page, size, sort, data?.accessToken).then((page) => {
                setTotalPages(page.totalPages);
                setResources(page.resources);
                setIsLoading(false);
            })
        }
        setMustReload(false);
    }, [page, size, sort, status, mustReload, data?.accessToken])

    if (status === "loading" || isLoading || !resources) {
        return (<Loader/>)
    }

    if (resources.length === 0) {
        return ErrorPage({errorCode: Errors.Empty, backRef: "/metastore/"})
    }

    /**
     * Trigger quickshare dialog to open.
     *
     * @param redirect Dummy argument required by runAction
     */
    function doQuickShare(redirect: string) {
        setOpenModal(true);
    }

    /**
     * Perform share action, i.e., update the schema with the new permissions.
     *
     * @param result The result returned by the quickshare dialog, i.e., OK=true, Cancel=false.
     * @param selectedValues The selected entries, i.e., userIds, that should receive READ access.
     */
    function shareIt(result: boolean, selectedValues?: string[]) {
        //close quickshare dialog
        setOpenModal(false);

        //nothing selected, reset and return
        if (!result || !selectedValues) {
            setSelectedResource({} as DataResource);
            return;
        }
        //get ACL difference from selection
        const aclEntries: string[] = getAclDiff(selectedValues, selectedResource.acls);

        //add new ACL entries with READ permissions
        aclEntries.map((sid: string) => {
            selectedResource.acls.push({"sid": sid, permission: Permission.READ});
        })

        //apply update
        const id = toast.loading("Updating access control list...");
        updateMetadataRecord("document", selectedResource, selectedResource.etag ? selectedResource.etag : "NoEtag", data?.accessToken).then((res) => {
            toast.update(id, {
                render: `Successfully updated access control list.`,
                type: "success",
                isLoading: false,
                autoClose: 1000,
                "onClose": () => {
                    setMustReload(true);
                }
            });
            //reload to reset etag
            setMustReload(true);
            setSelectedResource({} as DataResource);
            router.push("/metastore/metadata");
        })
    }

    return (
        <div>
            <div className="rounded-lg w-auto">
                {resources?.map((element: DataResource, i: number) => {
                    //make edit optional depending on permissions
                    const actionEvents: ActionButtonInterface[] = [];

                    if (userCanEdit(element, data?.user.preferred_username, data?.user.groups)) {
                        actionEvents.push(new QuickShareMetadataDocumentAction(element.id).getDataCardAction());
                    }

                    if (userCanView(element, data?.user.preferred_username, data?.user.groups)) {
                        actionEvents.push(new ViewMetadataDocumentAction(element.id).getDataCardAction());
                    }

                    if (userCanEdit(element, data?.user.preferred_username, data?.user.groups)) {
                        actionEvents.push(new EditMetadataDocumentAction(element.id).getDataCardAction());
                    }

                    if (userCanDownload(element, data?.user.preferred_username, data?.user.groups)) {
                        actionEvents.push(new DownloadMetadataDocumentAction(element.id, "schema", element.resourceType.value === "JSON_Schema" ? "json" : "xml").getDataCardAction());
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
                            <MetadataDocumentCard
                                key={element.id}
                                metadataRecord={element}
                                detailed={false}
                                actionEvents={actionEvents}
                                cardCallbackAction={handleAction}
                            ></MetadataDocumentCard>
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
