'use client';

import React, {useEffect, useState} from "react";

import {useRouter} from "next/navigation";
import {ContentInformation, DataResource, Permission} from "@/lib/definitions";
import {useDebouncedCallback} from "use-debounce";
import {useSession} from "next-auth/react";
import {runAction} from "@/lib/base-repo/actions/actionExecutor";
import {fetchDataResource, fetchAllContentInformation} from "@/lib/base-repo/client_data";
import Loader from "@/components/general/Loader";
import ErrorPage from "@/components/ErrorPage/ErrorPage";
import {Errors} from "@/components/ErrorPage/ErrorPage.d";
import {resourcePermissionForUser} from "@/lib/permission-utils";
import {ToggleTagAction} from "@/lib/base-repo/actions/toggleTagAction";
import {Tabs} from "@/components/ui/tabs";
import {Icon} from "@iconify/react";
import useUserPrefs from "@/lib/hooks/userUserPrefs";
import {TabsHeader} from "@/app/base-repo/components/DataResourceEditor/tabs/TabsHeader";
import {UploadTab} from "@/app/base-repo/components/DataResourceEditor/tabs/UploadTab";
import {ContentTab} from "@/app/base-repo/components/DataResourceEditor/tabs/ContentTab";
import {MetadataTab} from "@/app/base-repo/components/DataResourceEditor/tabs/MetadataTab";
import {AccessTab} from "@/app/base-repo/components/DataResourceEditor/tabs/AccessTab";
import {AddTagDialog} from "@/app/base-repo/components/DataResourceEditor/dialogs/AddTagDialog";

export default function DataResourceEditor({...props}) {
    //general props
    const target = props.target ? props.target : "upload";
    const id = props.id;
    const createMode = props.createMode;
    const router = useRouter();

    //loading props
    const [isLoading, setIsLoading] = useState(true);
    const [mustReload, setMustReload] = useState(false);

    //content-specific props
    const [resource, setResource] = useState({} as DataResource);
    const [etag, setEtag] = useState('' as string);
    const [content, setContent] = useState([] as Array<ContentInformation>);

    //add tag specific props
    const [openTagAddDialog, setOpenTagAddDialog] = useState<boolean>(false);
    const [contentToTag, setContentToTag] = useState<string>();

    //auth and prefs
    const {data, status} = useSession();
    const {userPrefs, updateUserPrefs} = useUserPrefs(data?.user.id);

    const handleAction = useDebouncedCallback((event) => {
        const eventIdentifier: string = event.detail.eventIdentifier;
        if (eventIdentifier.startsWith("toggleTag")) {
            //open addTag modal
            let parts: string[] = eventIdentifier.split("_");
            if (parts.length == 3) {
                setContentToTag(`${parts[2]}`);
                setOpenTagAddDialog(true);
                return;
            }
        }

        runAction(eventIdentifier, (redirect: string) => {
            //reset etag for reload
            setMustReload(true);
            router.push(redirect);
        });
    });


    //fetch data resource and content information
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

    //const thumb: string = thumbFromContentArray(content);

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

    function toggleHelp() {
        updateUserPrefs({helpVisible: !userPrefs.helpVisible});
    }

    function addTagCallback(filename: string | undefined, tag: string | undefined) {
        if (filename && tag) {
            handleAction({detail: {eventIdentifier: new ToggleTagAction(id, filename, tag).getActionIdentifier()}});
        }
        setContentToTag("");
        setOpenTagAddDialog(false);
    }

    return (
        <div className="flex col-2">
            <div className="grid flex-grow justify-items-stretch">
                <button onClick={() => toggleHelp()} title={"Show/Hide Help"} className={"justify-self-end"}><Icon
                    fontSize={24}
                    icon={"material-symbols-light:help-outline"}
                    className={"h-8 w-8 mr-2"}
                    style={userPrefs.helpVisible ? {color: "#0F0"} : {color: "#F00"}}
                />
                </button>
                <Tabs defaultValue={createMode ? "metadata" : target} className="w-full">
                    <TabsHeader createMode={createMode}/>
                    <UploadTab resourceId={id} userPrefs={userPrefs}/>
                    <ContentTab resource={resource} content={content} userPrefs={userPrefs} session={data}
                                actionCallback={handleAction}/>
                    <MetadataTab createMode={createMode} resource={resource} etag={etag} schema={props.schema}
                                 userPrefs={userPrefs} updateResourceCallback={setResource}/>
                    <AccessTab resource={resource} etag={etag} userPrefs={userPrefs}/>
                </Tabs>

            </div>
            <AddTagDialog openModal={openTagAddDialog} resourceId={id} filename={contentToTag}
                          actionCallback={addTagCallback}/>

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
