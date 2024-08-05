'use client';

import {useState} from "react";
import Uppy from "@uppy/core";
import XHRUpload from "@uppy/xhr-upload";
import {Dashboard} from "@uppy/react";
import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';
import { usePathname } from 'next/navigation'
import {installEventHandlers} from "@/app/base-repo/components/ContentUpload/useContentUpload";
import clsx from "clsx";

export default function ContentUpload(params) {
    const id = params.id;
    const path = usePathname();

    const [uppy] = useState(() => new Uppy()
        .use(XHRUpload, { endpoint: "http://localhost:3000/api/",method: "post",formData: true, fieldName: "file" }))

    installEventHandlers(uppy, id, path);

    return (
        <div className="w-full flex mb-6 justify-left">
            <button id="pick-files" className="mt-4 mx-5 rounded-md px-4 py-2 text-sm hover:underline float-end text-center inline-flex items-center bg-contextual"
            >Open Upload Dialog</button>
            <Dashboard uppy={uppy} inline={false} trigger={"#pick-files"} closeAfterFinish={true} closeModalOnClickOutside={true} showProgressDetails={true}/>
        </div>

    );
}
