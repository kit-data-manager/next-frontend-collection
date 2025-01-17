'use client';

import React, {useEffect, useState} from "react";
import Uppy, {UploadCallback} from "@uppy/core";
import XHRUpload from "@uppy/xhr-upload";
import {Dashboard} from "@uppy/react";
import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';
import {useRouter} from 'next/navigation'
import {installEventHandlers} from "@/app/base-repo/components/ContentUpload/useContentUpload";
import {useTheme} from "next-themes";
import {DataChanged} from "@/app/base-repo/components/DataResourceEditor/useDataResourceEditor";
import JsonForm from "@/components/jsonform";
import {DataResource} from "@/lib/definitions";
import {UserPrefsType} from "@/lib/hooks/userUserPrefs";
import {Button} from "@/components/ui/button";
import Loader from "@/components/general/Loader";
import {toast} from "react-toastify";
import {Icon} from "@iconify/react";

interface RecordFileUploaderProps {
    createMode: boolean;
    schema: any;
    updateResourceCallback: Function;
    reloadCallback: Function;
    resource?: DataResource;
}

export default function RecordFileUploader({
                                               createMode,
                                               resource,
                                               schema,
                                               updateResourceCallback,
                                               reloadCallback
                                           }: RecordFileUploaderProps) {
    const basePath: string = (process.env.NEXT_PUBLIC_BASE_PATH ? process.env.NEXT_PUBLIC_BASE_PATH : "");
    const router = useRouter();
    const [uppy, setUppy] = useState(() => new Uppy()
        .use(XHRUpload, {
            endpoint: createMode ? `${basePath}/api/metastore/create` : `${basePath}/api/metastore/update`,
            method: createMode ? "post" : "put",
            formData: true,
            bundle: true
        }));

    const {theme} = useTheme();
    const [uppyTheme, setUppyTheme] = useState(theme === "system" ? "auto" : theme);
    const [editorReady, setEditorReady] = useState(false);
    const [metadata, setMetadata] = useState(resource);

    const [confirm, setConfirm] = useState(false);

    useEffect(() => {
        setUppyTheme(theme === "system" ? "auto" : theme);
        uppy.close();
        setUppy(new Uppy()
            .use(XHRUpload, {
                endpoint: createMode ? `${basePath}/api/metastore/create` : `${basePath}/api/metastore/update`,
                method: createMode ? "post" : "put",
                formData: true,
                bundle: true
            }));
    }, [theme]);

    if (!schema) {
        return (<Loader/>)
    }

    uppy.getPlugin("Dashboard:ThumbnailGenerator")?.setOptions({thumbnailWidth: 10, thumbnailHeight: 10});

    uppy.setOptions({
        //autoProceed: true,
        restrictions: {maxNumberOfFiles: 2, minNumberOfFiles: 2}
    })

    uppy.off("upload", ()=>{}).on('upload', (result) => {
        for (let i = 0; i < result.fileIDs.length; i++) {
            let fileID = result.fileIDs[i];

            const file = uppy.getFile(fileID);
            uppy.setFileState(fileID, {
                xhrUpload: {
                    //  ...file.xhrUpload,
                    endpoint: `${basePath}/api/metastore/create`,
                    fieldName: file.name === "record.json" ? "record" : "schema"
                }
            })
        }
    });

    uppy.off("complete", ()=>{}).on('complete', (result) => {
        uppy.resetProgress();
        const successful = result.successful.length;
        const failed = result.failed.length;
        if (failed > 0) {
            toast.error(`Failed to upload ${failed} file(s).`, {
                    autoClose: 1000,
                    isLoading: false
                }
            );
        }

        toast.success(`Successfully uploaded ${successful} file(s).`, {
            type: "success",
            isLoading: false,
            autoClose: 1000,
            "onClose": () => {
                if (reloadCallback) {
                    reloadCallback();
                }
            }
        });
    });

    function updateData(data: object) {
        setMetadata(data as DataResource);
        setConfirm(data != undefined);
    }

    function addMetadataToUppy() {
        console.log("ADD META ", JSON.stringify(metadata));
        uppy.addFile({
            name: 'record.json', // file name
            type: 'application/json', // file type
            data: new Blob([JSON.stringify(metadata)]), // file blob
            source: 'Local', // optional, determines the source of the file, for example, Instagram.
            isRemote: false, // optional, set to true if actual file is not in the browser, but on some remote server, for example,
            // when using companion in combination with Instagram.
        });
    }

    return (
        <div className="w-full flex grid-cols-3 mb-6 justify-left">
            <div className={"grow"}>
                {editorReady ? null :
                    <span>Loading editor...</span>
                }
                <JsonForm id="DataResource" schema={schema} data={resource}
                          setEditorReady={setEditorReady}
                          onChange={(d: object) => updateData(d)}/>

            </div>
            <div className={"flex-shrink"}>
                <Button variant={"accent"} title={"Add Metadata to Upload"} className={"h-full ml-4 mr-4"} disabled={!confirm} onClick={addMetadataToUppy}><Icon icon={"ic:outline-double-arrow"}/></Button>
            </div>
                <div className={"flex-none"}>
                    <Dashboard uppy={uppy}
                               note={`You must upload exactly 2 files: a metadata record and a schema file. For creating a metadata record, use the form to the right and select add schema file afterwards.`}
                               theme={uppyTheme as "auto"|"dark"|"light"|undefined}
                               showSelectedFiles={true}
                               showProgressDetails={true}/>
                </div>
            </div>

            );
            }
