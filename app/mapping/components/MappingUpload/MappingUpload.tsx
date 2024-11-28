'use client';

import {useEffect, useState} from "react";
import Uppy from "@uppy/core";
import XHRUpload from "@uppy/xhr-upload";
import {Dashboard} from "@uppy/react";
import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';
import {installEventHandlers} from "@/app/mapping/components/MappingUpload/useMappingUpload";

export default function MappingUpload(params: any) {
    const id = params.id;
    const fileTypes: string[] = params.fileTypes;
    const callback = params.mappingCallback;
    const callbackComplete = params.uploadCompleteCallback;
    const mappingBaseUrl: string = process.env.NEXT_PUBLIC_MAPPING_BASE_URL ? process.env.NEXT_PUBLIC_MAPPING_BASE_URL : '';

    const [uppy] = useState(() => new Uppy()
        .use(XHRUpload, {
            endpoint: `${mappingBaseUrl}/api/v1/mappingExecution/schedule/?mappingID=${id}`,
            method: "post",
            formData: true,
            fieldName: "document"
        }));

    if (fileTypes && fileTypes.length > 0) {
        uppy.setOptions({
            restrictions: {maxNumberOfFiles: 5, allowedFileTypes: fileTypes}
        })
    } else {
        uppy.setOptions({
            restrictions: {maxNumberOfFiles: 5}
        })
    }

    useEffect(() => {
        function successCallback(file, response) {
            callback(response.body);
        }

        uppy.on('upload-success', successCallback);

        function completeCallback() {
            callbackComplete();
        }

        uppy.on('complete', completeCallback);


        return () => {
            uppy.off('upload-success', successCallback);
            uppy.off('complete', completeCallback);
        }
    }, [id, callback]);

    installEventHandlers(uppy, id, callback);

    return (
        <div className="w-full flex mb-6 justify-center">
            <Dashboard uppy={uppy} width={384} height={256} showProgressDetails={true}/>
        </div>

    );
}
