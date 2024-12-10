'use client';

import {useEffect, useState} from "react";
import Uppy from "@uppy/core";
import XHRUpload from "@uppy/xhr-upload";
import {Dashboard} from "@uppy/react";
import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';
import {usePathname, useRouter} from 'next/navigation'
import {installEventHandlers} from "@/app/base-repo/components/ContentUpload/useContentUpload";
import {useTheme} from "next-themes";

export default function ContentUpload(params: any) {
    const id = params.id;
    const path = usePathname();
    const basePath: string = (process.env.NEXT_PUBLIC_BASE_PATH ? process.env.NEXT_PUBLIC_BASE_PATH : "");
    const router = useRouter();
    const [uppy, setUppy] = useState(() => new Uppy()
        .use(XHRUpload, {endpoint: `${basePath}/api/create`, method: "post", formData: true, fieldName: "file"}));

    const {theme} = useTheme();
    const [uppyTheme, setUppyTheme] = useState(theme === "system" ? "auto" : theme);

    useEffect(() => {
        setUppyTheme(theme === "system" ? "auto" : theme);
        uppy.close();
        setUppy(new Uppy()
            .use(XHRUpload, {endpoint: `${basePath}/api/create`, method: "post", formData: true, fieldName: "file"}));
    }, [theme]);

    uppy.getPlugin("Dashboard:ThumbnailGenerator")?.setOptions({thumbnailWidth: 10, thumbnailHeight: 10});

    uppy.setOptions({
        //autoProceed: true,
        restrictions: {maxNumberOfFiles: 10}
    })
    installEventHandlers(uppy, id, () => {
        if (path) {
            router.push(path)
        }
    });
    /*
    <DragDrop uppy={uppy} height={128} note={"Drop new files here..."}/>
    <button id="pick-files"
            className="mt-4 mx-5 rounded-md px-4 py-2 text-sm hover:underline float-end text-center
                    inline-flex items-center bg-accent text-accent-foreground"
    >Open Upload Dialog
    </button>*/

    return (
        <div className="w-full flex mb-6 justify-left">
            <Dashboard uppy={uppy} theme={uppyTheme} width={256} height={180} showSelectedFiles={false}
                       showProgressDetails={true}/>
        </div>

    );
}
