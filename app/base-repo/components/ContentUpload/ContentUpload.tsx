'use client';

import {useEffect, useState} from "react";
import Uppy from "@uppy/core";
import XHRUpload from "@uppy/xhr-upload";
import Dashboard from '@uppy/react/dashboard';
import '@uppy/core/css/style.min.css'
import '@uppy/dashboard/css/style.min.css'
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
        .use(XHRUpload, {
            endpoint: `${baseUrl}/api/v1/dataresources`,
            method: "post",
            formData: true,
            fieldName: "file",
            getResponseData(xhr) {
                return { url: xhr.getResponseHeader("location") };
            }
        }));
    const {data, status} = useSession();

    const {theme} = useTheme();
    const [uppyTheme, setUppyTheme] = useState(theme === "system" ? "auto" : theme?theme : "auto");

    useEffect(() => {
        setUppyTheme(theme === "system" ? "auto" : theme?theme : "auto");
        uppy.destroy();
        setUppy(new Uppy()
            .use(XHRUpload, {
                endpoint: `${baseUrl}/api/v1/dataresources`,
                method: "post",
                formData: true,
                fieldName: "file",
                getResponseData(xhr) {
                    return { url: xhr.getResponseHeader("location") };
                }
            }));
        installEventHandlers(uppy, id, data?.accessToken, () => {
            reloadCallback(`/base-repo/resources/${id}/edit?target=content`);
        });
    }, [theme, status, id, baseUrl, data?.accessToken]);

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
                       width={256} height={180} showSelectedFiles={true}/>
        </div>

    );
}
