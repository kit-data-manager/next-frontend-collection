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
import {fetchMetadataSchemas, updateMetadataSchema} from "@/lib/metastore/client_data";
import {ViewSchemaAction} from "@/lib/actions/metastore/viewSchemaAction";
import {EditSchemaAction} from "@/lib/actions/metastore/editSchemaAction";
import SchemaCard from "@/app/metastore/components/SchemaCard/SchemaCard";
import {QuickShareDialog} from "@/components/dialogs/QuickShareDialog";
import {useDebouncedCallback} from "use-debounce";
import {METASTORE_ACTIONS} from "@/lib/actions/action";
import {runAction} from "@/lib/actions/actionExecutor";
import {useRouter} from "next/navigation";
import {getAclDiff} from "@/lib/base-repo/client_data";
import {DownloadAction} from "@/lib/actions/metastore/downloadAction";
import {QuickShareSchemaAction} from "@/lib/actions/metastore/quickShareSchemaAction";
import {toast} from "react-toastify";

export default function SchemaListing({page, size, sort}: {
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

        console.log("SELECTION ", resource);

        setSelectedResource(resource);

        if (eventIdentifier.startsWith(METASTORE_ACTIONS.QUICK_SHARE_SCHEMA)) {
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
            fetchMetadataSchemas(page, size, sort, data?.accessToken).then((page) => {
                setTotalPages(page.totalPages);
                setResources(page.resources);
                setIsLoading(false);
            })
        }
        setMustReload(false);
    }, [page, size, sort, status, mustReload])

    if (status === "loading" || isLoading || !resources) {
        return (<Loader/>)
    }

    if (resources.length === 0) {
        return ErrorPage({errorCode: Errors.NotFound, backRef: "/metastore/schemas"})
    }

    function doQuickShare(redirect: string) {
        setOpenModal(true);
    }

    function shareIt(result: boolean, selectedValues?: string[]) {
        setOpenModal(false);

        if (!result || !selectedValues){
            return;
            setSelectedResource({} as DataResource);
        }
        const aclEntries: string[] = getAclDiff(selectedValues, selectedResource.acls);

        aclEntries.map((sid: string) => {
            selectedResource.acls.push({"sid": sid, permission: Permission.READ});
        })
        const id = toast.loading("Updating access control list...");
        console.log("selec ", selectedResource);

        updateMetadataSchema(selectedResource, selectedResource.etag ? selectedResource.etag : "NoEtag" ,data?.accessToken).then((res) => {
           console.log("RESPO ", res)
            toast.update(id, {
                render: `Successfully updated access control list.`,
                type: "success",
                isLoading: false,
                autoClose: 1000,
                "onClose": () => {
                  setMustReload(true);
                }
            });
            //reset etag for reload
            setMustReload(true);
            setSelectedResource({} as DataResource);
            router.push("/metastore/schemas");
        })
    }

    return (
        <div>
            <div className="rounded-lg p-4 lg:pt-0 lg:w-auto">
                {resources?.map((element: DataResource, i: number) => {
                    //make edit optional depending on permissions
                    const actionEvents: ActionButtonInterface[] = [];

                    if (userCanEdit(element, data?.user.preferred_username, data?.user.groups)) {
                        actionEvents.push(new QuickShareSchemaAction(element.id).getDataCardAction());
                    }

                    if (userCanView(element, data?.user.preferred_username, data?.user.groups)) {
                        actionEvents.push(new ViewSchemaAction(element.id).getDataCardAction());
                    }

                    if (userCanEdit(element, data?.user.preferred_username, data?.user.groups)) {
                        actionEvents.push(new EditSchemaAction(element.id).getDataCardAction());
                    }

                    if (userCanDownload(element, data?.user.preferred_username, data?.user.groups)) {
                        actionEvents.push(new DownloadAction(element.id, "schema", element.resourceType.value === "JSON_Schema" ? "json" : "xml").getDataCardAction());
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
                            <SchemaCard
                                key={element.id}
                                resource={element}
                                actionEvents={actionEvents}
                                cardCallbackAction={handleAction}
                            ></SchemaCard>
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
