'use client';

import {useEffect, useState} from "react";
import Uppy from "@uppy/core";
import XHRUpload from "@uppy/xhr-upload";
import {Dashboard} from "@uppy/react";
import '@uppy/core/dist/style.min.css';
import '@uppy/dashboard/dist/style.min.css';
import {useRouter} from 'next/navigation'
import {installEventHandlers} from "@/app/base-repo/components/ContentUpload/useContentUpload";
import {useTheme} from "next-themes";

interface ContentUploadProps {
    id: string;
    reloadCallback: Function;
}

export default function ContentUpload({id, reloadCallback}: ContentUploadProps) {
    const basePath: string = (process.env.NEXT_PUBLIC_BASE_PATH ? process.env.NEXT_PUBLIC_BASE_PATH : "");
    const router = useRouter();
    const [uppy, setUppy] = useState(() => new Uppy()
        .use(XHRUpload, {endpoint: `${basePath}/api/base-repo/create`, method: "post", formData: true, fieldName: "file"}));

    const {theme} = useTheme();
    const [uppyTheme, setUppyTheme] = useState(theme === "system" ? "auto" : theme?theme : "auto");

    useEffect(() => {
        setUppyTheme(theme === "system" ? "auto" : theme?theme : "auto");
        uppy.close();
        setUppy(new Uppy()
            .use(XHRUpload, {endpoint: `${basePath}/api/base-repo/create`, method: "post", formData: true, fieldName: "file"}));
    }, [theme]);

    uppy.getPlugin("Dashboard:ThumbnailGenerator")?.setOptions({thumbnailWidth: 10, thumbnailHeight: 10});

    uppy.setOptions({
        //autoProceed: true,
        restrictions: {maxNumberOfFiles: 10}
    })

    installEventHandlers(uppy, id, () => {
        reloadCallback(`/base-repo/resources/${id}/edit?target=content`);
    });

    return (
        <div className="w-full flex mb-6 justify-left">
            <Dashboard uppy={uppy}  theme={uppyTheme as "auto"|"dark"|"light"|undefined}
                       width={256} height={180} showSelectedFiles={true}
                       showProgressDetails={true}/>
        </div>

    );
}
