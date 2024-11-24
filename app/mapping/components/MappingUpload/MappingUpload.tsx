'use client';

import {useEffect, useState} from "react";
import Uppy from "@uppy/core";
import XHRUpload from "@uppy/xhr-upload";
import {Dashboard} from "@uppy/react";
import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';
import {installEventHandlers} from "@/app/mapping/components/MappingUpload/useMappingUpload";

export default function MappingUpload(params:any) {
    const id = params.id;
    const callback = params.mappingCallback;
   // const path = usePathname();

    const [uppy] = useState(() => new Uppy()
        .use(XHRUpload, { endpoint: `http://localhost:8095/api/v1/mappingExecution/async/${id}`,method: "post",formData: true, fieldName: "document" }));

    useEffect(() => {
        function successCallback(file, response){
            callback(response.body);
        }
        uppy.on('upload-success', successCallback);

        return () => {
            uppy.off('upload-success', successCallback);
        }
    }, [id, callback]);

    installEventHandlers(uppy, id, callback);

    return (
        <div className="w-full flex mb-6 justify-center">
            <Dashboard uppy={uppy} width={256} height={256} showProgressDetails={true}/>
        </div>

    );
}
