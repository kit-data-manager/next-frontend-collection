'use client';

import JsonForm from "@/components/jsonform";
import ConfirmCancelComponent from "@/components/general/confirm-cancel-component";
import React, {useState} from "react";


import {usePathname, useRouter} from "next/navigation";
import ContentUpload from "@/app/base-repo/components/ContentUpload/ContentUpload";
import {ContentInformation, DataResource} from "@/lib/definitions";
import {useDebouncedCallback} from "use-debounce";
import 'react-toastify/dist/ReactToastify.css';
import {
    deleteContentEventIdentifier,
    downloadContentEventIdentifier
} from "@/lib/event-utils";
import DataResourceListingSkeleton from "@/app/base-repo/components/DataResourceListing/DataResourceListingSkeleton";
import {
    DataChanged,
    DoCreateDataResource,
    DoUpdateDataResource,
    HandleEditorAction
} from "@/app/base-repo/components/Editor/useDataResourceEditor";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import {ActionEvent, DataCardCustomEvent} from "../../../../../data-view-web-component";
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

export default function DataResourceEditor({...props}) {
    const [confirm, setConfirm] = useState(false);
    const [editorReady, setEditorReady] = useState(false);
    const [currentData, setCurrentData] = useState(props.data ? props.data as DataResource : {} as DataResource);
    const router:AppRouterInstance = useRouter();
    const path:string|null = usePathname();

    const [currentContent, setCurrentContent] = useState(props.content ? props.content as Array<ContentInformation> : [] as Array<ContentInformation>);
    const [tag, setTag] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [actionContent, setActionContent] = useState("");

    const createMode = props.createMode;

    const handleAction = useDebouncedCallback(HandleEditorAction);

    function closeModal(){
        setOpenModal(false);
    }
    function assignTag() {
        //empty check
        console.log("NEW TAG ", tag + "-" + currentData.id + "/data/" + actionContent);
        setActionContent("");
        setOpenModal(false);
        setTag("");
    }


    //TODO Identify current content for tag assignment in modal to use path there.
    return (
        <div>
            <Accordion type="multiple" defaultValue={["upload"]}>
                {!createMode ?
                    <AccordionItem value={"upload"}>
                        <AccordionTrigger>File Upload</AccordionTrigger>
                        <AccordionContent>
                            <ContentUpload id={currentData.id}></ContentUpload>
                        </AccordionContent>
                    </AccordionItem> : <></>}
                {!createMode ?
                    <AccordionItem value={"content"}>
                        <AccordionTrigger >Current Content</AccordionTrigger>
                        <AccordionContent>
                            {currentContent && currentContent.length > 0 ?
                                <div className="rounded-lg p-2 md:pt-0">
                                    {currentContent.map((element: ContentInformation, i: number) => {
                                        let actionEvents = [
                                            downloadContentEventIdentifier(element.parentResource.id, element.relativePath),
                                            deleteContentEventIdentifier(element.relativePath)
                                        ];

                                        return (
                                            <ContentInformationCard
                                                key={i}
                                                data={element}
                                                onActionClick={(ev:DataCardCustomEvent<ActionEvent>) => handleAction(ev, currentData, currentContent, path, setOpenModal, setActionContent)}
                                                actionEvents={actionEvents}></ContentInformationCard>
                                        )
                                    })}
                                </div>
                                : <div className="rounded-lg p-2 md:pt-0"><p className={"text-info text-xl"}>No content
                                    available</p></div>}
                        </AccordionContent>
                    </AccordionItem> : <></>}
                <AccordionItem value={"metadata"}>
                    {createMode ?
                        <>
                            <AccordionTrigger onClick={() => {}}>Resource Metadata</AccordionTrigger>
                            <AccordionContent hidden={false}>
                                    {editorReady ? null :
                                        <span>Loading editor...</span>
                                    }
                                    <JsonForm id="DataResource" schema={props.schema} data={currentData}
                                              setEditorReady={setEditorReady}
                                              onChange={(d:object) => DataChanged(d, setConfirm, setCurrentData)}/>
                                    {props.etag ?
                                        <ConfirmCancelComponent confirmLabel={"Commit"}
                                                                cancelLabel={"Cancel"}
                                                                confirmCallback={() => DoUpdateDataResource(props.etag, currentData, router)}
                                                                cancelHref={`/base-repo/resources/${currentData.id}`}
                                                                confirm={confirm}
                                        /> :
                                        <ConfirmCancelComponent confirmLabel={"Create"}
                                                                cancelLabel={"Cancel"}
                                                                confirmCallback={() => DoCreateDataResource(currentData, router)}
                                                                cancelHref={`/base-repo/resources`}
                                                                confirm={confirm}
                                        />
                                    }
                            </AccordionContent>
                        </>
                        :
                        <>
                            <AccordionTrigger>Resource Metadata</AccordionTrigger>
                            <AccordionContent>
                                    {editorReady ? null :
                                        <span>Loading editor...</span>
                                    }
                                    <JsonForm id="DataResource" schema={props.schema} data={currentData}
                                              setEditorReady={setEditorReady}
                                              onChange={(d:object) => DataChanged(d, setConfirm, setCurrentData)}></JsonForm>
                                    {props.etag ?
                                        <ConfirmCancelComponent confirmLabel={"Commit"}
                                                                cancelLabel={"Cancel"}
                                                                confirmCallback={() => DoUpdateDataResource(props.etag, currentData, router)}
                                                                cancelHref={`/base-repo/resources/${currentData.id}`}
                                                                confirm={confirm}
                                        /> :
                                        <ConfirmCancelComponent confirmLabel={"Create"}
                                                                cancelLabel={"Cancel"}
                                                                confirmCallback={() => DoCreateDataResource(currentData, router)}
                                                                cancelHref={`/base-repo/resources`}
                                                                confirm={confirm}
                                        />
                                    }
                            </AccordionContent>
                        </>}
                </AccordionItem>
            </Accordion>

            <Dialog open={openModal} modal={true} onOpenChange={closeModal}>
                <DialogContent  className="bg-secondary">
                    <DialogHeader>
                        <DialogTitle>Add New Tag</DialogTitle>
                        <DialogDescription  className="secondary">
                           Provide a tag to add to this content element.
                        </DialogDescription>
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Input type="text" id="tag" placeholder="newTag" className="bg-secondary border-1" onChange={(event:any) => setTag(event.target.value)}/>
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
