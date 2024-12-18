'use client';

import {useEffect, useState} from "react";
import Uppy from "@uppy/core";
import XHRUpload from "@uppy/xhr-upload";
import {Dashboard} from "@uppy/react";
import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';

interface MappingUploadProps {
    mappingId: string;
    fileTypes: string[] | undefined;
    singleUploadCallback: Function;
    uploadCompleteCallback: Function;
}

export default function MappingUpload({mappingId, fileTypes= ["*/*"], singleUploadCallback, uploadCompleteCallback}: MappingUploadProps) {
    const mappingBaseUrl: string = process.env.NEXT_PUBLIC_MAPPING_BASE_URL ? process.env.NEXT_PUBLIC_MAPPING_BASE_URL : '';

    const [uppy] = useState(() => new Uppy()
        .use(XHRUpload, {
            endpoint: `${mappingBaseUrl}/api/v1/mappingExecution/schedule/?mappingID=${mappingId}`,
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
            singleUploadCallback(file.name, response.body);
        }

        uppy.on('upload-success', successCallback);

        function completeCallback() {
            uploadCompleteCallback();
        }

        uppy.on('complete', completeCallback);

        return () => {
            uppy.off('upload-success', successCallback);
            uppy.off('complete', completeCallback);
        }
    }, [mappingId, fileTypes, singleUploadCallback]);

  /*  uppy.off("complete", null).on('complete', (result) => {
        uppy.close();
        const successful = result.successful.length;
        const failed = result.failed.length;
        if(failed > 0) {
            toast.error(`Failed to upload ${failed} file(s).`);
        }

        toast.success(`Successfully uploaded ${successful} file(s).`,{
        });
    });*/
    return (
        <div className="w-full flex mb-6 justify-center">
            <Dashboard uppy={uppy} note={`You can upload 5 files at once. InputType limitations of the selected mapping (${fileTypes}) may apply. `} width={384} height={256} showProgressDetails={true}/>

     </div>

    );
}
