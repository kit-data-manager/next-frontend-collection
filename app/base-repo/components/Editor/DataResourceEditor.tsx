'use client';

import JsonForm from "@/components/jsonform";
import ConfirmCancelComponent from "@/components/general/confirm-cancel-component";
import React, {useState} from "react";
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
import DataResourceDataCardWrapper from "@/components/dataresources/data-resource-data-card-wrapper";
import MyLoader from "@/components/dataresources/MyLoader";
import {
    DataChanged,
    DoCreateDataResource,
    DoUpdateDataResource,
    HandleEditorAction
} from "@/app/base-repo/components/Editor/useDataResourceEditor";

export default function DataResourceEditor(props) {
    const [confirm, setConfirm] = useState(false);
    const [editorReady, setEditorReady] = useState(false);
    const [currentData, setCurrentData] = useState(props.data ? props.data : {});
    const router = useRouter();
    const path = usePathname();

    const [currentContent, setCurrentContent] = useState(props.content ? props.content : []);
    const createMode = props.createMode;

    const handleAction =  useDebouncedCallback(HandleEditorAction);

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
                   let actionEvents=[
                        downloadContentEventIdentifier(element.parentResource.id, element.relativePath),
                        deleteContentEventIdentifier(element.relativePath)
                    ];

                    return (
                        <DataResourceDataCardWrapper
                            key={i}
                            data={element}
                            onActionClick={ev => handleAction(ev, currentData, currentContent, path, router)}
                            actionEvents={actionEvents}></DataResourceDataCardWrapper>
                    )
            })}
            </div>
            : null }
            <h2 className={`${lusitana.className} mb-4 text-l md:text-xl border-b-2 border-sky-200 rounded-sm`}>
                Resource Metadata
            </h2>
            {editorReady ? null :
            <MyLoader count={2} />
            }
            {/* <span className={clsx("bg-blue-100 font-bold px-5 py-[7px] rounded",
                {
                    'hidden': editorReady
                })
            }>Loading Editor...</span>*/}

            <JsonForm id="DataResource" schema={props.schema} data={currentData} setEditorReady={setEditorReady} onChange={(d) => DataChanged(d, setConfirm, setCurrentData)}></JsonForm>
            {props.etag ?
                <ConfirmCancelComponent confirmLabel={"Commit"}
                                    cancelLabel={"Cancel"}
                                    confirmCallback={() => DoUpdateDataResource(props.etag, currentData, router)}
                                    cancelHref={`/base-repo/resources/${currentData.id}`}
                                    confirm = {confirm}
                                   >
                </ConfirmCancelComponent>:
                <ConfirmCancelComponent confirmLabel={"Create"}
                                        cancelLabel={"Cancel"}
                                        confirmCallback={() => DoCreateDataResource(currentData, router)}
                                        cancelHref={`/base-repo/resources`}
                                        confirm = {confirm}
                >
                </ConfirmCancelComponent>
            }

        </div>
    )
}
