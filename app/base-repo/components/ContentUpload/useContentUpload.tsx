import {toast} from "react-toastify";
import Uppy from "@uppy/core";

export function installEventHandlers(uppy: Uppy, resourceId: string, onCloseCallback: Function) {
    //add filename to metadata
    // @ts-ignore
    uppy.off("file-added", undefined).on('file-added', (file) => {
        uppy.setFileMeta(file.id, {
            name: file.name,
        });
    });
    const basePath: string = (process.env.NEXT_PUBLIC_BASE_PATH ? process.env.NEXT_PUBLIC_BASE_PATH : "");

    //add filename to base-url
    // @ts-ignore
    uppy.off("upload", null).on('upload', (result) => {

        for (let i = 0; i < result.fileIDs.length; i++) {
            let fileID = result.fileIDs[i];
            const file = uppy.getFile(fileID);
            uppy.setFileState(fileID, {
                xhrUpload: {
                    //  ...file.xhrUpload,
                    endpoint: `${basePath}/api/create?resourceId=${resourceId}&filename=${encodeURIComponent(file.meta.name)}`
                }
            })
        }
    });


    //add completed handler
    // @ts-ignore
    uppy.off("complete", null).on('complete', (result) => {
        uppy.resetProgress();
        const successful = result.successful.length;
        const failed = result.failed.length;
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
                onCloseCallback();
            }
        });
    });
}
