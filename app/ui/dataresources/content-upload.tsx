'use client';

import {useState} from "react";
import Uppy from "@uppy/core";
import XHRUpload from "@uppy/xhr-upload";
import {Dashboard} from "@uppy/react";
import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';
import { usePathname } from 'next/navigation'
import {toast} from "react-toastify";

export default function ContentUpload(props) {
    const id = props.id;
    const path = usePathname();

    const [uppy] = useState(() => new Uppy()
        .use(XHRUpload, { endpoint: "http://localhost:3000/api/",method: "post",formData: true, fieldName: "file" }))

    //add filename to metadata
    uppy.off("file-added", null).on('file-added', (file) => {
        uppy.setFileMeta(file.id, {
            name: file.name,
        });
    });

    //add filename to base-url
    uppy.off("upload", null).on('upload', (result) => {
        for (let i = 0; i < result.fileIDs.length; i++) {
            let fileID = result.fileIDs[i];
            const file = uppy.getFile(fileID);
            uppy.setFileState(fileID, {
                xhrUpload: {
                    ...file.xhrUpload,
                    endpoint: `http://localhost:8081/api/v1/dataresources/${id}/data/${encodeURIComponent(file.meta.name)}`
                }
            })
        }
    });

    uppy.off("complete", null).on('complete', (result) => {
        uppy.close();
        const successful = result.successful.length;
        const failed = result.failed.length;
        if(failed > 0) {
            toast.error(`Failed to upload ${failed} file(s).`);
        }
        toast.info(`Successfully uploaded ${successful} file(s).`,{
            "onClose": () =>{
                window.document.location=path;
            }
        });
    });

    return (
        <div className="w-full flex mb-6 justify-left">
            <button id="pick-files" className="mt-4 mx-5 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400 float-end text-center inline-flex items-center"
            >Open Upload Dialog</button>
            <Dashboard uppy={uppy} inline={false} trigger={"#pick-files"} closeAfterFinish={true} closeModalOnClickOutside={true} showProgressDetails={true}/>
        </div>

    );
}
