'use client';

import JsonForm from "@/components/jsonform";
import ConfirmCancelComponent from "@/components/general/confirm-cancel-component";
import React, {useState} from "react";
import {Button, CustomFlowbiteTheme, Label, Modal, TextInput} from "flowbite-react";
import {usePathname, useRouter} from "next/navigation";
import ContentUpload from "@/app/base-repo/components/ContentUpload/ContentUpload";
import {lusitana} from "@/components/fonts";
import {ContentInformation} from "@/lib/definitions";
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

export default function DataResourceEditor(props) {
    const [confirm, setConfirm] = useState(false);
    const [editorReady, setEditorReady] = useState(false);
    const [currentData, setCurrentData] = useState(props.data ? props.data : {});
    const router = useRouter();
    const path = usePathname();

    const [currentContent, setCurrentContent] = useState(props.content ? props.content : []);
    const [tag, setTag] = useState("");
    const [openModal, setOpenModal] = useState(false);
    const [actionContent, setActionContent] = useState("");

    const createMode = props.createMode;

    const handleAction = useDebouncedCallback(HandleEditorAction);

    function updateTag(newTag: string) {
        setTag(newTag);
    }

    function onCloseModal(success: boolean) {
        setActionContent("");
        setOpenModal(false);
    }

    function assignTag() {
        console.log("NEW TAG ", tag + "-" + currentData.id + "/data/" + actionContent);
        setActionContent("");
        setOpenModal(false);
    }

    console.log(currentContent);
/*
    const accordionTheme = {
        root: {
            base: 'divide-y-2 border-2 divide-primary border-primary dark:divide-primary dark:border-primary',
        },
        content: {
            base: 'p-5 first:rounded-t-lg last:rounded-b-lg',
        },
        title: {
            base: 'flex w-full items-center justify-between p-5 text-left font-medium first:rounded-t-lg last:rounded-b-lg',
            flush: {
                off: 'hover:underline focus:ring-4 focus:bg-secondary dark:hover:underline dark:focus:bg-secondary',
                on: 'bg-secondary',
            },
            open: {
                off: 'bg-secondary',
                on: 'bg-secondary',
            },
        },
    };
*/
    return (
        <div>
        <Accordion>
            <Accordion.Panel>
                <Accordion.Title className={`${lusitana.className} mb-4 text-l md:text-xl rounded-sm`}>File Upload</Accordion.Title>
                <Accordion.Content>
                    {!createMode ?
                            <ContentUpload id={currentData.id}></ContentUpload> : null
                    }
                </Accordion.Content>
            </Accordion.Panel>
            <Accordion.Panel>
                <Accordion.Title className={`${lusitana.className} mb-4 text-l md:text-xl rounded-sm`}>Current Content</Accordion.Title>
                <Accordion.Content>
                    {currentContent ?
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
                                                onActionClick={ev => handleAction(ev, currentData, currentContent, path, setOpenModal, setActionContent)}
                                                actionEvents={actionEvents}></DataResourceCard>
                                        )
                                    })}
                                </div>
                        : null}
                </Accordion.Content>
            </Accordion.Panel>
            <Accordion.Panel>
                <Accordion.Title className={`${lusitana.className} mb-4 text-l md:text-xl rounded-sm`}>Resource Metadata</Accordion.Title>
                <Accordion.Content >
                    <>
                    {editorReady ? null :
                        <DataResourceListingSkeleton count={2}/>
                    }
                    <JsonForm id="DataResource" schema={props.schema} data={currentData} setEditorReady={setEditorReady}
                              onChange={(d) => DataChanged(d, setConfirm, setCurrentData)}></JsonForm>
                        {props.etag ?
                            <ConfirmCancelComponent confirmLabel={"Commit"}
                                                    cancelLabel={"Cancel"}
                                                    confirmCallback={() => DoUpdateDataResource(props.etag, currentData, router)}
                                                    cancelHref={`/base-repo/resources/${currentData.id}`}
                                                    confirm={confirm}
                            >
                            </ConfirmCancelComponent> :
                            <ConfirmCancelComponent confirmLabel={"Create"}
                                                    cancelLabel={"Cancel"}
                                                    confirmCallback={() => DoCreateDataResource(currentData, router)}
                                                    cancelHref={`/base-repo/resources`}
                                                    confirm={confirm}
                            >
                            </ConfirmCancelComponent>
                        }
                        </>
                </Accordion.Content>
            </Accordion.Panel>
        </Accordion>

            <Modal show={openModal} onClose={onCloseModal} size="md" popup>
                <Modal.Header/>
                <Modal.Body>
                    <div className="space-y-6">
                        <h3 className="text-xl font-medium">Assign new Tag
                            to {currentContent.relativePath}</h3>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="tag" value="New Tag"/>
                            </div>
                            <TextInput
                                id="tag"
                                placeholder="newTag"
                                onChange={(event) => updateTag(event.target.value)}
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
