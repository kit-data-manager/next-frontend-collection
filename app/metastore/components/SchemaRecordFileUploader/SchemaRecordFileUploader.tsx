'use client';

import React, {useEffect, useState} from "react";
import Uppy from "@uppy/core";
import XHRUpload from "@uppy/xhr-upload";
import Dashboard from "@uppy/react/dashboard";
import '@uppy/core/css/style.min.css'
import '@uppy/dashboard/css/style.min.css'
import {useTheme} from "next-themes";
import JsonForm from "@/components/JsonForm/jsonform";
import {DataResource} from "@/lib/definitions";
import {Button} from "@/components/ui/button";
import Loader from "@/components/general/Loader";
import {Icon} from "@iconify-icon/react";
import {useSession} from "next-auth/react";
import {installEventHandlers} from "@/app/metastore/components/SchemaRecordFileUploader/useSchemaRecordFileUploader";

interface RecordFileUploaderProps {
    schema: any;
    reloadCallback: Function;
}

export default function SchemaRecordFileUploader({
                                               schema,
                                               reloadCallback
                                           }: RecordFileUploaderProps) {
    const baseUrl: string = (process.env.NEXT_PUBLIC_METASTORE_BASE_URL ? process.env.NEXT_PUBLIC_METASTORE_BASE_URL : "");
    const {theme} = useTheme();
    const [uppyTheme, setUppyTheme] = useState(theme === "system" ? "auto" : theme);
    const [editorReady, setEditorReady] = useState(false);
    const [metadata, setMetadata] = useState({} as DataResource);
    const {data, status} = useSession();
    const [confirm, setConfirm] = useState(false);
    const [uppy, setUppy] = useState(() => new Uppy()
        .use(XHRUpload, {
            endpoint: `${baseUrl}/api/v2/schemas/`,
            method: "post",
            formData: true,
            bundle: true,
            getResponseData(xhr) {
                return { url: xhr.getResponseHeader("location") };
            }
        }));

    useEffect(() => {
        setUppyTheme(theme === "system" ? "auto" : theme);
        uppy.destroy();
        setUppy(new Uppy()
            .use(XHRUpload, {
                endpoint: `${baseUrl}/api/v2/schemas/`,
                method: "post",
                headers: {
                    "Authorization": `Bearer ${data?.accessToken}`
                },
                bundle: true,
                onAfterResponse(xhr) {
                    if(xhr.status != 201){
                        throw new Error(JSON.parse(xhr.responseText).detail)
                    }
                }
            }));

        installEventHandlers(uppy, data?.accessToken, () => {
            reloadCallback(`/metastore/schemas/${metadata.id}/edit?target=metadata`);
        });
    }, [theme, status, data?.accessToken]);

    if (!schema) {
        return (<Loader/>)
    }

    uppy.getPlugin("Dashboard:ThumbnailGenerator")?.setOptions({thumbnailWidth: 10, thumbnailHeight: 10});

    uppy.setOptions({
        restrictions: {maxNumberOfFiles: 2, minNumberOfFiles: 2}
    })

    installEventHandlers(uppy, data?.accessToken, () => {
        reloadCallback(`/metastore/schemas/${metadata.id}/edit?target=metadata`);
    });

    /**
     * Callback function for JsonForm to notify on updated metadata. The function sets the
     * metadata state and the confirm state in case a valid object was provided.
     *
     * @param {object} data  - The resource of undefined in case of validation errors.
     */
    function updateData(data: object) {
        if (!data) {
            setConfirm(false);
        } else {
            setMetadata(data as DataResource);
            setConfirm(true);
        }
    }

    /**
     * Forward the current metadata set by JsonForm as upload to Uppy.
     * The upload received a default filename (record.json), mime type, and the serialized metadata.
     */
    function addMetadataToUppy() {
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
        <div className="flex flex-col xl:flex-row mb-6 justify-left">
            <div className={"grow"}>
                {editorReady ? null :
                    <span>Loading editor...</span>
                }
                <JsonForm id="SchemaRecord" schema={schema} data={metadata}
                          setEditorReady={setEditorReady}
                          onChange={(d: object) => updateData(d)}/>

            </div>
            <div className={"shrink"}>
                <Button variant={confirm ? "success" : "destructive"} title={"Add Metadata to Upload"}
                        className={"w-full xl:w-4/6 xl:h-full xl:ml-4 xl:mr-4"}
                        disabled={!confirm} onClick={addMetadataToUppy}>
                    <Icon className={"w-12 h-12 invisible xl:visible"} icon={"ic:outline-double-arrow"}/>
                    <Icon className={"w-12 h-12 xl:hidden visible"} icon={"ri:arrow-down-double-line"}/>
                </Button>
            </div>
                <div className={"flex-none"}>
                    <Dashboard uppy={uppy}
                               note={`You must upload exactly 2 files: a metadata record and a schema file. For creating a metadata record, use the form to the right and select add schema file afterwards.`}
                               theme={uppyTheme as "auto"|"dark"|"light"|undefined}
                               showSelectedFiles={true}/>
                </div>
            </div>

            );
            }
