'use client';

import JsonForm from "@/components/jsonform";
import ConfirmCancelComponent from "@/components/general/confirm-cancel-component";
import React, {useState} from "react";
import {Button, Label, Modal, TextInput} from "flowbite-react";
import {usePathname, useRouter} from "next/navigation";
import ContentUpload from "@/app/base-repo/components/ContentUpload/ContentUpload";
import {lusitana} from "@/components/fonts";
import {ContentInformation, DataResource} from "@/lib/definitions";
import {useDebouncedCallback} from "use-debounce";
import 'react-toastify/dist/ReactToastify.css';
import {
    deleteContentEventIdentifier,
    downloadContentEventIdentifier
} from "@/lib/event-utils";
import DataResourceCard from "@/app/base-repo/components/DataResourceCard/DataResourceCard";
import DataResourceListingSkeleton from "@/app/base-repo/components/DataResourceListing/DataResourceListingSkeleton";
import {
    DataChanged,
    DoCreateDataResource,
    DoUpdateDataResource,
    HandleEditorAction
} from "@/app/base-repo/components/Editor/useDataResourceEditor";
import {Accordion} from "flowbite-react";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import {ActionEvent, DataCardCustomEvent} from "../../../../../data-view-web-component";

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

    function updateTag(newTag: string) {
        setTag(newTag);
    }

    function onCloseModal() {
        setActionContent("");
        setOpenModal(false);
    }

    function assignTag() {
        console.log("NEW TAG ", tag + "-" + currentData.id + "/data/" + actionContent);
        setActionContent("");
        setOpenModal(false);
    }

    const accordionTheme = {
        root: {
            base: 'bg-secondary divide-y-2 border-2 divide-primary border-primary dark:divide-primary dark:border-primary',

        },
        content: {
            base: 'p-5 first:rounded-t-lg last:rounded-b-lg background foreground'
        },
        title: {
            base: `${lusitana.className} flex w-full items-center justify-between p-5 text-left bg-secondary text-secondary-foreground font-medium first:rounded-t-lg last:rounded-b-lg`,
            flush: {
                off: 'hover:underline focus:bg-ring dark:hover:underline bg-secondary text-secondary-foreground',
                on: 'bg-secondary',
            },
            open: {
                off: 'bg-secondary text-secondary-foreground',
                on: 'bg-secondary text-secondary-foreground',
            },
        },
    };


    //TODO Identify current content for tag assignment in modal to use path there.
    return (
        <div>
            <Accordion>
                {!createMode ?
                    <Accordion.Panel>
                        <Accordion.Title theme={accordionTheme.title}>File Upload</Accordion.Title>
                        <Accordion.Content theme={accordionTheme.content}>
                            <ContentUpload id={currentData.id}></ContentUpload>
                        </Accordion.Content>
                    </Accordion.Panel> : <></>}
                {!createMode ?
                    <Accordion.Panel>
                        <Accordion.Title theme={accordionTheme.title}>Current Content</Accordion.Title>
                        <Accordion.Content theme={accordionTheme.content}>
                            {currentContent && currentContent.length > 0 ?
                                <div className="rounded-lg p-2 md:pt-0">
                                    {currentContent.map((element: ContentInformation, i: number) => {
                                        let actionEvents = [
                                            downloadContentEventIdentifier(element.parentResource.id, element.relativePath),
                                            deleteContentEventIdentifier(element.relativePath)
                                        ];

                                        return (
                                            <DataResourceCard
                                                key={i}
                                                data={element}
                                                onActionClick={(ev:DataCardCustomEvent<ActionEvent>) => handleAction(ev, currentData, currentContent, path, setOpenModal, setActionContent)}
                                                actionEvents={actionEvents}></DataResourceCard>
                                        )
                                    })}
                                </div>
                                : <div className="rounded-lg p-2 md:pt-0"><p className={"text-info text-xl"}>No content
                                    available</p></div>}
                        </Accordion.Content>
                    </Accordion.Panel> : <></>}
                <Accordion.Panel>
                    {createMode ?
                        <>
                            <Accordion.Title theme={accordionTheme.title} onClick={() => {
                            }}>Resource Metadata</Accordion.Title>
                            <Accordion.Content theme={accordionTheme.content} hidden={false}>
                                <>
                                    {editorReady ? null :
                                        <DataResourceListingSkeleton count={2}/>
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
                                </>
                            </Accordion.Content>
                        </>
                        :
                        <>
                            <Accordion.Title theme={accordionTheme.title}>Resource Metadata</Accordion.Title>
                            <Accordion.Content theme={accordionTheme.content}>
                                <>
                                    {editorReady ? null :
                                        <DataResourceListingSkeleton count={2}/>
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
                                </>
                            </Accordion.Content>
                        </>}
                </Accordion.Panel>
            </Accordion>

            <Modal show={openModal} onClose={onCloseModal} size="md" popup>
                <Modal.Header/>
                <Modal.Body>
                    <div className="space-y-6">
                        <h3 className="text-xl font-medium">Assign new Tag</h3>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="tag" value="New Tag"/>
                            </div>
                            <TextInput
                                id="tag"
                                placeholder="newTag"
                                onChange={(event:any) => updateTag(event.target.value)}
                                required
                            />
                        </div>

                        <div className="w-full">
                            <Button onClick={() => assignTag()}>Assign Tag</Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}
