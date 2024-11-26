'use client';

import JsonForm from "@/components/jsonform";
import ConfirmCancelComponent from "@/components/general/confirm-cancel-component";
import React, {useEffect, useState} from "react";

import {useRouter} from "next/navigation";
import ContentUpload from "@/app/base-repo/components/ContentUpload/ContentUpload";
import {ContentInformation, DataResource, Permission} from "@/lib/definitions";
import {useDebouncedCallback} from "use-debounce";
import {
    userCanDelete,
    userCanDownload,
} from "@/lib/event-utils";
import {
    DataChanged,
    DoCreateDataResource,
    DoUpdateDataResource
} from "@/app/base-repo/components/DataResourceEditor/useDataResourceEditor";
import ContentInformationCard from "@/app/base-repo/components/ContentInformationCard/ContentInformationCard";
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from "@/components/ui/accordion";
import {
    Dialog,
    DialogContent, DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import {thumbFromContentArray} from "@/lib/base-repo/datacard-utils";
import {useSession} from "next-auth/react";
import {ActionButtonInterface} from "@/app/base-repo/components/DataResourceCard/DataResourceCard.d";
import {DeleteContentAction} from "@/lib/base-repo/actions/deleteContentAction";
import {DownloadContentAction} from "@/lib/base-repo/actions/downloadContentAction";
import {runAction} from "@/lib/base-repo/actions/actionExecutor";
import {fetchDataResource, fetchDataResourceEtag, fetchAllContentInformation} from "@/lib/base-repo/client_data";
import Loader from "@/components/general/Loader";
import ErrorPage from "@/components/ErrorPage/ErrorPage";
import {Errors} from "@/components/ErrorPage/ErrorPage.d";
import {resourcePermissionForUser} from "@/lib/permission-utils";
import {ToggleTagAction} from "@/lib/base-repo/actions/toggleTagAction";
import {ActionEvent, DataCardCustomEvent} from "@kit-data-manager/data-view-web-component";

export default function DataResourceEditor({...props}) {
    const [confirm, setConfirm] = useState(false);
    const [editorReady, setEditorReady] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [resource, setResource] = useState({} as DataResource);
    const [content, setContent] = useState([] as Array<ContentInformation>);
    const [tag, setTag] = useState("");

    const target = props.target ? props.target : "upload";
    const [mustReload, setMustReload] = useState(false);
    const [openModal, setOpenModal] = useState(false);
    const [actionContent, setActionContent] = useState("");
    const {data, status} = useSession();

    const id = props.id;
    const router = useRouter();
    const createMode = props.createMode;

    const handleAction = useDebouncedCallback((event) => {
        const eventIdentifier: string = event.detail.eventIdentifier;
        if(eventIdentifier.startsWith("toggleTag")){
            //open modal
            let parts:string[] = eventIdentifier.split("_");
            if(parts.length == 3) {
                setActionContent(`${id}-${parts[2]}`);
                setOpenModal(true);
                return;
            }
        }

        runAction(eventIdentifier, (redirect: string) => {
            //reset etag for reload
            setMustReload(true);
            router.push(redirect);
        });
    });

    const assignTag = () => {
        const filename = actionContent.replace(`${id}-`, "");
        setOpenModal(false);
        setActionContent("");
        const ident = new ToggleTagAction(id, filename, tag).getActionIdentifier();
        handleAction({detail:{eventIdentifier:ident}});
    };

    useEffect(() => {
        if (createMode) {
            setIsLoading(false);
        } else {
            setIsLoading(true);
            fetchDataResource(id, data?.accessToken).then((res) => {
                return res;
            }).then(async (res) => {
                await fetchAllContentInformation(res, data?.accessToken).
                then((data) => setContent(data)).
                catch(error => {
                    console.error(`Failed to fetch children for resource ${id}`, error)
                });
                return setResource(res);
            }).then(() => {
                setIsLoading(false);
            }).catch(error => {
                console.log(`Failed to fetch resource ${id}`, error)
                setIsLoading(false);
            })
        }
        setMustReload(false);
    }, [id, data?.accessToken, createMode, status, mustReload]);


    if (status === "loading" || isLoading) {
        return (<Loader/>)
    }

    const thumb: string = thumbFromContentArray(content);

    if (!isLoading) {
        if (!createMode) {
            if (!resource || !resource.id) {
                return ErrorPage({errorCode: Errors.NotFound, backRef: "/base-repo/resources"})
            }

            let permission: Permission = resourcePermissionForUser(resource, data?.user.id, data?.user.groups);
            if (permission < Permission.WRITE.valueOf()) {
                return ErrorPage({errorCode: Errors.Forbidden, backRef: "/base-repo/resources"})
            }
        }
    }

    function closeModal() {
        setOpenModal(false);
    }

    return (
        <div className="flex flex-grow col-2">
            <div className="flex-grow ">
                <Accordion type="multiple" defaultValue={[target]}>
                    {!createMode ?
                        <AccordionItem value={"upload"}>
                            <AccordionTrigger>File Upload</AccordionTrigger>
                            <AccordionContent>
                                <ContentUpload id={id}></ContentUpload>
                            </AccordionContent>
                        </AccordionItem> : <></>}
                    {!createMode ?
                        <AccordionItem value={"content"}>
                            <AccordionTrigger>Current Content</AccordionTrigger>
                            <AccordionContent>
                                {content && content.length > 0 ?
                                    <div className="rounded-lg p-2 md:pt-0">
                                        {content.map((element: ContentInformation, i: number) => {
                                            let actionEvents: ActionButtonInterface[] = [];
                                            if (userCanDelete(resource, data?.user.id, data?.user.groups)) {
                                                actionEvents.push(new DeleteContentAction(id, element.relativePath).getDataCardAction());
                                            }

                                            if (userCanDownload(resource, data?.user.id, data?.user.groups)) {
                                                actionEvents.push(new DownloadContentAction(id, element.relativePath).getDataCardAction());
                                            }

                                            return (
                                                <ContentInformationCard
                                                    key={i}
                                                    data={element}
                                                    onActionClick={(ev) => handleAction(ev)}
                                                    actionEvents={actionEvents}></ContentInformationCard>
                                            )
                                        })}
                                    </div>
                                    : <div className="rounded-lg p-2 md:pt-0"><p className={"text-info text-xl"}>No
                                        content
                                        available</p></div>}
                            </AccordionContent>
                        </AccordionItem> : <></>}
                    <AccordionItem value={"metadata"}>
                        {!createMode ?
                        <AccordionTrigger  onClick={() => {}}>Resource Metadata</AccordionTrigger>:
                            <AccordionTrigger>Resource Metadata</AccordionTrigger>
                        }
                        <AccordionContent>
                            {editorReady ? null :
                                <span>Loading editor...</span>
                            }
                            <JsonForm id="DataResource" schema={props.schema} data={resource}
                                      setEditorReady={setEditorReady}
                                      onChange={(d: object) => DataChanged(d, setConfirm, setResource)}/>
                            {!createMode ?
                                <ConfirmCancelComponent confirmLabel={"Commit"}
                                                        cancelLabel={"Cancel"}
                                                        confirmCallback={() => DoUpdateDataResource(resource, router)}
                                                        cancelHref={`/base-repo/resources/${id}`}
                                                        confirm={confirm}
                                /> :
                                <ConfirmCancelComponent confirmLabel={"Create"}
                                                        cancelLabel={"Cancel"}
                                                        confirmCallback={() => DoCreateDataResource(resource, router)}
                                                        cancelHref={`/base-repo/resources`}
                                                        confirm={confirm}
                                />
                            }
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
            <div className="grow-0 justify-end ml-6 border border-t-0 border-b-0 border-l-accent border-r-0 ">
                <img src={thumb}
                     className={"w-48 min-w-6 ml-6"}/>
            </div>
            <Dialog open={openModal} modal={true} onOpenChange={closeModal}>
                <DialogContent className="bg-secondary">
                    <DialogHeader>
                        <DialogTitle>Add New Tag</DialogTitle>
                        <DialogDescription className="secondary">
                            Provide a tag to add to this content element.
                        </DialogDescription>
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Input type="text" id="tag" placeholder="newTag" className="bg-secondary border-1"
                                   onChange={(event: any) => setTag(event.target.value)}/>
                        </div>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={() => assignTag()} className={"bg-accent text-accent-foreground"}>Add</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
