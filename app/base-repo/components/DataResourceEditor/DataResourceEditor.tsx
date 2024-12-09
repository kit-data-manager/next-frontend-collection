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
import {fetchDataResource, fetchAllContentInformation} from "@/lib/base-repo/client_data";
import Loader from "@/components/general/Loader";
import ErrorPage from "@/components/ErrorPage/ErrorPage";
import {Errors} from "@/components/ErrorPage/ErrorPage.d";
import {resourcePermissionForUser} from "@/lib/permission-utils";
import {ToggleTagAction} from "@/lib/base-repo/actions/toggleTagAction";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Upload, CircleSlash2, ShieldCheck} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {Icon} from "@iconify/react";
import {KanbanBoard} from "@/components/KanbanBoard/KanbanBoard";

export default function DataResourceEditor({...props}) {
    const [confirm, setConfirm] = useState(false);
    const [editorReady, setEditorReady] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [resource, setResource] = useState({} as DataResource);
    const [etag, setEtag] = useState('' as string);
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
        if (eventIdentifier.startsWith("toggleTag")) {
            //open modal
            let parts: string[] = eventIdentifier.split("_");
            if (parts.length == 3) {
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
        handleAction({detail: {eventIdentifier: ident}});
    };

    useEffect(() => {
        if (createMode) {
            setIsLoading(false);
        } else {
            setIsLoading(true);
            fetchDataResource(id, data?.accessToken).then((res) => {
                if (res.etag) {
                    setEtag(res.etag);
                }
                return res;
            }).then(async (res) => {
                await fetchAllContentInformation(res, data?.accessToken).then((data) => setContent(data)).catch(error => {
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
    }, [id, data?.accessToken, etag, createMode, status, mustReload]);


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
                <Tabs defaultValue={target} className="w-full">
                    <TabsList>
                        <TabsTrigger value="upload"><Upload className="h-4 w-4 mr-2"/> Upload Content</TabsTrigger>
                        <TabsTrigger value="content"><Icon fontSize={16} icon={"mdi:file-edit-outline"}
                                                           className="h-4 w-4 mr-2"/> Edit Content</TabsTrigger>
                        <TabsTrigger value="metadata"><Icon fontSize={16}
                                                            icon={"material-symbols-light:edit-square-outline"}
                                                            className="h-4 w-4 mr-2"/>Edit Metadata</TabsTrigger>
                        <TabsTrigger value="access"><ShieldCheck className="h-4 w-4 mr-2"/>Access Permissions</TabsTrigger>
                    </TabsList>
                    <TabsContent value="upload">
                        <Alert>
                            <Upload className="h-4 w-4"/>
                            <AlertTitle>Upload Content</AlertTitle>
                            <AlertDescription>
                                <span>Here you can upload new files to your resource. This is possible if you have WRITE
                                    permissions and
                                    as long as the resource is in state VOLATILE. For uploading, just drag&drop files
                                    from your local
                                    filesystem to the upload area below or click <Badge className={"text-info"}
                                                                                        variant="outline">browse files</Badge> and select one
                                    or more files for upload.
                                    To start the upload. press the upload button.</span>
                                <br/><br/>
                                <span className={"text-warn"}> Be aware that you may upload a maximum of 10 files at once and that no two files with
                                the same name can be uploaded to a resource.</span>
                            </AlertDescription>
                        </Alert>
                        <ContentUpload id={id}></ContentUpload>
                    </TabsContent>
                    <TabsContent value="content">
                        {content && content.length > 0 ?
                            <>
                                <Alert>
                                    <Icon fontSize={16} icon={"mdi:file-edit-outline"} className="h-4 w-4 mr-2"/>
                                    <AlertTitle>Edit Content</AlertTitle>
                                    <AlertDescription>
                                <span>Here you can edit and access existing content associated with your resource. You may add a tag via the <Badge
                                    variant="info">+</Badge>
                                    button, you can  <Badge variant="outline"><Icon
                                        fontSize={16} icon={"material-symbols-light:download"}/> Download</Badge> single files,
                                    or you can <Badge variant="outline"><Icon fontSize={16}
                                                                              icon={"material-symbols-light:skull-outline"}/> Delete</Badge> files if you have WRITE permissions.
                                    Furthermore, you can mark a file as <Badge variant="thumb_unset">Thumb</Badge> image. A thumb is shown in the resources listing and can be assigned to all files of type jpg, gif, and png
                                    which are smaller than 100 Kb. Active thumb images are marked with <Badge
                                        variant="thumb_set">Thumb</Badge>. If multiple files are marked as thumb, only the latest assignment will count.
                                </span>
                                        <br/><br/>
                                        <span className={"text-warn "}>Be aware that removed content cannot be restored. Once a file was removed it has to be re-uploaded.</span>
                                    </AlertDescription>
                                </Alert>
                                <div className="rounded-lg p-2 mt-2 md:pt-0">
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
                            </>
                            :
                            <Alert>
                                <CircleSlash2 className="h-4 w-4"/>
                                <AlertTitle>No Content Available</AlertTitle>
                                <AlertDescription>
                                <span>There was no content uploaded, yet. If you have WRITE permissions, you may switch to the <Badge
                                    variant="outline">
                                    <Upload className="h-4 w-4 mr-2"/> Upload Content</Badge> tab and initially upload files.
                                    Otherwise, you may wait until the owner of the resource has uploaded contents.
                                </span>
                                </AlertDescription>
                            </Alert>
                        }
                    </TabsContent>
                    <TabsContent value="metadata">
                        <Alert>
                            <Icon fontSize={16} icon={"material-symbols-light:edit-square-outline"}
                                  className="h-4 w-4 mr-2"/>
                            <AlertTitle>Edit Metadata</AlertTitle>
                            <AlertDescription>
                                <span>Here you can edit the resource&apos;s metadata. Below, you&apos;ll find a form with a pre-selection of available metadata.
                                    Mandatory elements are marked with a <span className={"text-error"}>*</span> and must be filled in order to allow to
                                    <Badge variant="thumb_set" className={"text-ring"}>Commit</Badge> changes or initially store a resource.  Information for
                                    each element can be shown by hovering over the tooltip icon <a
                                        className="tooltips">ⓘ</a>. Complex properties are collapsed
                                    and can be expanded by clicking the expand button <Badge variant="outline"><i
                                        className={"fas fa-caret-right"}></i></Badge>.
                                    There are more, optional metadata fields available, which can be made available using the
                                    <Badge variant="properties"><i className={"fas fa-list mr-2"}></i>properties</Badge> button.
                                </span>
                            </AlertDescription>
                        </Alert>
                        {editorReady ? null :
                            <span>Loading editor...</span>
                        }
                        <JsonForm id="DataResource" schema={props.schema} data={resource}
                                  setEditorReady={setEditorReady}
                                  onChange={(d: object) => DataChanged(d, setConfirm, setResource)}/>
                        {!createMode ?
                            <ConfirmCancelComponent confirmLabel={"Commit"}
                                                    cancelLabel={"Cancel"}
                                                    confirmCallback={() => DoUpdateDataResource(resource, etag, router)}
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
                    </TabsContent>

                    <TabsContent value="access">
                        <Alert>
                            <ShieldCheck className="h-4 w-4"/>
                            <AlertTitle>Access Permissions</AlertTitle>
                            <AlertDescription>
                                <span>Here you can control who has access to this resource. </span>
                            </AlertDescription>
                        </Alert>
                            <KanbanBoard/>

                    </TabsContent>
                </Tabs>

            </div>

            <Dialog open={openModal} modal={true} onOpenChange={closeModal}>
                <DialogContent className="bg-secondary" onPointerDownOutside={() => {
                }} onInteractOutside={() => {
                }}>
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
                        <Button onClick={() => assignTag()}
                                className={"bg-accent text-accent-foreground"}>Add</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )

    /*
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
                                : <div className="rounded-lg p-2 md:pt-0"><p
                                    className={"text-info text-xl"}>No
                                    content
                                    available</p></div>}
                        </AccordionContent>
                    </AccordionItem> : <></>}
                <AccordionItem value={"metadata"}>
                    {!createMode ?
                        <AccordionTrigger onClick={() => {
                        }}>Resource Metadata</AccordionTrigger> :
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
                                                    confirmCallback={() => DoUpdateDataResource(resource, etag, router)}
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

    </div>
    )*/
}
