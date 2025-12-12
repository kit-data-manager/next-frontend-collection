import {toast} from "react-toastify";
import Uppy from "@uppy/core";

export function installEventHandlers(uppy: Uppy, accessToken?: string, onCloseCallback?: Function) {
    //add filename to metadata
    const baseUrl: string = (process.env.NEXT_PUBLIC_METASTORE_BASE_URL ? process.env.NEXT_PUBLIC_METASTORE_BASE_URL : "http://localhost:8040");

    // @ts-ignore
    uppy.off("upload", null).on('upload', (uploadId, result) => {
        result.forEach((file) => {
            uppy.setFileState(file.id, {
                xhrUpload: {
                    fieldName: file.name === "record.json" ? "record" : "document",
                    endpoint: `${baseUrl}/api/v2/metadata`,
                    headers: {
                        "Authorization": `Bearer ${accessToken}`
                    }
                },
            });
        });
    });

    // @ts-ignore
    uppy.off("upload-error", null).on('upload-error', (file, error, response) => {
        toast.error(`Failed create metadata document. Cause: ${error.message}`, {
                isLoading: false
            }
        );
    });

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
