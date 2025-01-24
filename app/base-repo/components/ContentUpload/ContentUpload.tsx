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
import {useSession} from "next-auth/react";

interface ContentUploadProps {
    id: string;
    reloadCallback: Function;
}

export default function ContentUpload({id, reloadCallback}: ContentUploadProps) {
    const baseUrl: string = (process.env.NEXT_PUBLIC_REPO_BASE_URL ? process.env.NEXT_PUBLIC_REPO_BASE_URL : "");
    const router = useRouter();

    const [uppy, setUppy] = useState(() => new Uppy()
        .use(XHRUpload, {endpoint: `${baseUrl}/api/v1/dataresources`, method: "post", formData: true, fieldName: "file"}));
    const {data, status} = useSession();

    const {theme} = useTheme();
    const [uppyTheme, setUppyTheme] = useState(theme === "system" ? "auto" : theme?theme : "auto");

    useEffect(() => {
        setUppyTheme(theme === "system" ? "auto" : theme?theme : "auto");
        uppy.close();
        setUppy(new Uppy()
            .use(XHRUpload, {endpoint: `${baseUrl}/api/v1/dataresources`, method: "post", formData: true, fieldName: "file"}));
        installEventHandlers(uppy, id, data?.accessToken, () => {
            reloadCallback(`/base-repo/resources/${id}/edit?target=content`);
        });
    }, [theme, status]);

    uppy.getPlugin("Dashboard:ThumbnailGenerator")?.setOptions({thumbnailWidth: 10, thumbnailHeight: 10});

    uppy.setOptions({
        //autoProceed: true,
        restrictions: {maxNumberOfFiles: 10}
    })

    installEventHandlers(uppy, id, data?.accessToken, () => {
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
