'use client';

import JsonForm from "@/app/ui/jsonform";
import ConfirmCancelComponent from "@/app/ui/general/confirm-cancel-component";
import React, {useState} from "react";
import clsx from "clsx";
import {usePathname, useRouter} from "next/navigation";
import ContentUpload from "@/app/ui/dataresources/content-upload";
import {lusitana} from "@/app/ui/fonts";
import {ContentInformation} from "@/app/lib/definitions";
import {DataCard} from "data-card-react";
import {useDebouncedCallback} from "use-debounce";
import 'react-toastify/dist/ReactToastify.css';
import {
    assignTagToContent, createDataResource, deleteContent,
    removeTagFromContent,
    updateDataResource
} from "@/app/lib/base-repo/client-utils";
import {humanFileSize} from "@/app/lib/format-utils";
import {
    deleteContentEventIdentifier,
    downloadContentEventIdentifier,
    getActionButton,
    REPO_EVENTS
} from "@/app/lib/event-utils";
import {propertiesForContentInformation} from "@/app/lib/base-repo/datacard-utils";
import {toast} from "react-toastify";
import DataResourceDataCardWrapper from "@/app/ui/dataresources/data-resource-data-card-wrapper";

export default function DataResourceEditor(props) {
    const [confirm, setConfirm] = useState(false);
    const [editorReady, setEditorReady] = useState(false);
    const [currentData, setCurrentData] = useState(props.data ? props.data : {});

    const [currentContent, setCurrentContent] = useState(props.content ? props.content : []);
    const createMode = props.createMode;
    const router = useRouter();
    const etag = props.etag;
    const path = usePathname();

    function dataChanged(data:object) {
        if(data === undefined){
            setConfirm(false);
        }else {
            setCurrentData(data);
            setConfirm(true);
        }
    }

    function doUpdateDataResource() {
        const redirectPath = `/base-repo/resources/${currentData.id}/view`;
        updateDataResource(currentData, etag).then((status) => {
            if(status == 200) {
                toast.success("Resource successfully updated.", {
                    "onClose": () => {
                        router.push(redirectPath);
                        router.refresh();
                    }
                });
            }else{
                toast.error("Failed to update resource. Status: " + status);
            }
        })
    }

    function doCreateDataResource() {
        const id = toast.loading("Creating resource...")

        createDataResource(currentData).then((response) => {
            if(response.status == 201) {
                return response.json();
            }else{
                toast.update(id, { render: "Failed to create resource.", type: "error", isLoading: false });
                Promise.reject("Failed to create resource.");
            }
        }).then(json => {
             toast.update(id, { render: "Resource created.", type: "success", isLoading: false,   autoClose: 3000,
                 "onClose": () => {
                     const redirectPath = `/base-repo/resources/${json.id}/edit`;
                     router.push(redirectPath);
                     router.refresh();
                 } });
         })
    }





    const handleAction = useDebouncedCallback((event) => {
        const eventIdentifier:string = event.detail.eventIdentifier;
        let parts = eventIdentifier.split("_");
        const contentIndex = Number.parseInt(parts[1]);
        const selectedContent: ContentInformation = currentContent[contentIndex];
        const redirectPath = `/base-repo/resources/${currentData.id}/edit`;


        if(parts[0] === REPO_EVENTS.DELETE_CONTENT){
            if(window.confirm("Do you really want to delete the file " + selectedContent.relativePath + "?")){
                deleteContent(selectedContent, redirectPath).then(status => {
                    if(status == 204) {
                        toast.success("Content " + selectedContent.relativePath + " successfully removed.",{
                            "onClose": () =>{
                                router.push(redirectPath);
                                router.refresh();
                            }
                        });
                    }else{
                        toast.error("Failed to remove content. Status: " + status);
                    }
                })
            }
        }else {
            //otherwise, handle add/remove thumb event
            currentContent.forEach((element: ContentInformation) => {
                removeTagFromContent(element, "thumb");
            });

            assignTagToContent(selectedContent, "thumb", path);
        }
    });

    return (
        <div className="mt-6 flow-root">
            {!createMode ?
            <>
                <h2 className={`${lusitana.className} mb-4 text-l md:text-xl border-b-2 border-sky-200 rounded-sm`}>
                    File Upload
                </h2>
                <ContentUpload id={currentData.id}></ContentUpload> </> : null
            }

            {currentContent ?
            <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
                {currentContent.map((element:ContentInformation, i:number) => {
                    let tags = [];
                    if(['jpg','jpeg','gif','png'].some(ext => element.relativePath.toLowerCase().endsWith(ext))) {
                        let isThumb = element.tags && element.tags.includes("thumb");
                        let thumbTag = {
                            "color": isThumb ? "#90EE90" : "#FFCCCB",
                            "text": "Thumb",
                            "eventIdentifier": isThumb ? `unmakeThumb_${i}` : `makeThumb_${i}`
                        };
                        tags.push(thumbTag);
                    }

                    if(element.tags) {
                        element.tags.map((tag) => {
                            if (tag.toLowerCase() != "thumb"){
                                tags.push({
                                    "color": "rgb(186 230 253)",
                                    "text": tag
                                })
                            }
                        })
                    }
                   let actionEvents=[
                        downloadContentEventIdentifier(element.parentResource.id, element.relativePath),
                        deleteContentEventIdentifier(i)
                    ];

                    return (
                        <DataResourceDataCardWrapper
                            key={i}
                            data={element}
                            onActionClick={ev => handleAction(ev)}
                            actionEvents={actionEvents}></DataResourceDataCardWrapper>
                    )
            })}
            </div>
            : null }
            <h2 className={`${lusitana.className} mb-4 text-l md:text-xl border-b-2 border-sky-200 rounded-sm`}>
                Resource Metadata
            </h2>
            <span className={clsx("bg-blue-100 font-bold px-5 py-[7px] rounded",
                {
                    'hidden': editorReady
                })
            }>Loading Editor...</span>

            <JsonForm id="DataResource" schema={props.schema} data={currentData} setEditorReady={setEditorReady} onChange={(d) => dataChanged(d)}></JsonForm>
            {etag ?
                <ConfirmCancelComponent confirmLabel={"Commit"}
                                    cancelLabel={"Cancel"}
                                    confirmCallback={() => doUpdateDataResource()}
                                    cancelHref={`/base-repo/resources/${currentData.id}`}
                                    confirm = {confirm}
                                   >
                </ConfirmCancelComponent>:
                <ConfirmCancelComponent confirmLabel={"Create"}
                                        cancelLabel={"Cancel"}
                                        confirmCallback={() => doCreateDataResource()}
                                        cancelHref={`/base-repo/resources`}
                                        confirm = {confirm}
                >
                </ConfirmCancelComponent>
            }

        </div>
    )
}
