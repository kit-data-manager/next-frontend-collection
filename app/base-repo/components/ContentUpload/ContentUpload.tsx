'use client';

import {useState} from "react";
import Uppy from "@uppy/core";
import XHRUpload from "@uppy/xhr-upload";
import {DragDrop} from "@uppy/react";
import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';
import {usePathname, useRouter} from 'next/navigation'
import {installEventHandlers} from "@/app/base-repo/components/ContentUpload/useContentUpload";

export default function ContentUpload(params: any) {
    const id = params.id;
    const path = usePathname();
    const basePath: string = (process.env.NEXT_PUBLIC_BASE_PATH ? process.env.NEXT_PUBLIC_BASE_PATH : "");
    const router = useRouter();
    const [uppy] = useState(() => new Uppy()
        .use(XHRUpload, {endpoint: `${basePath}/api/create`, method: "post", formData: true, fieldName: "file"}));

    installEventHandlers(uppy, id, () => {
        if (path) {
            router.push(path)
        }
    });

    return (
        <div className="w-full flex mb-6 justify-left">
            <DragDrop uppy={uppy} height={128} note={"Drop new files here..."}/>
        </div>

    );
}
