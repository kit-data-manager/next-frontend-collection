import {toast} from "react-toastify";
import Uppy from "@uppy/core";

export function installEventHandlers(uppy: Uppy, resourceId?: string, accessToken?: string, onCloseCallback?: Function) {
    //add filename to metadata
    // @ts-ignore
    uppy.off("file-added", () => {
    }).on('file-added', (file) => {
        uppy.setFileMeta(file.id, {
            name: file.name,
        });
    });
    const baseUrl: string = (process.env.NEXT_PUBLIC_REPO_BASE_URL ? process.env.NEXT_PUBLIC_REPO_BASE_URL : "http://localhost:8080");

    //add filename to base-url
    // @ts-ignore
    uppy.off("upload", () => {
    }).on('upload', (uploadId, result) => {
        result.forEach((file) => {
            if (resourceId) {
                uppy.setFileState(file.id, {
                    xhrUpload: {
                        //  ...file.xhrUpload,
                        //endpoint: `${basePath}/api/base-repo/createContent?resourceId=${resourceId}&filename=${file.name}`
                        endpoint: `${baseUrl}/api/v1/dataresources/${resourceId}/data/${file.name}`,
                        headers: {
                            "Authorization": `Bearer ${accessToken}`
                        }
                    }
                })
            } else {
                uppy.setFileState(file.id, {
                    xhrUpload: {
                        //  ...file.xhrUpload,
                        endpoint: `${baseUrl}/api/v1/dataresources/`
                    }
                })
            }
        });
    });


    //add completed handler
    // @ts-ignore
    uppy.off("complete", null).on('complete', (result) => {
        uppy.resetProgress();

        const successful = result.successful ? result.successful.length : 0;
        const failed = result.failed ? result.failed.length : 0;
        if (failed > 0) {
            toast.error(`Failed to upload ${failed} file(s).`, {
                    autoClose: 1000,
                    isLoading: false
                }
            );
        }

        toast.success(`Successfully uploaded ${successful} file(s).`, {
            type: "success",
            isLoading: false,
            autoClose: 1000,
            "onClose": () => {
                if (onCloseCallback) {
                    onCloseCallback();
                }
            }
        });
    });
}
