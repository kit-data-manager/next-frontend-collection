import {toast} from "react-toastify";
import Uppy from "@uppy/core";

export function installEventHandlers(uppy:Uppy, mappingId:string, mappingCallback:Function){
    //add filename to metadata
    // @ts-ignore
   /* uppy.off("file-added", undefined).on('file-added', (file) => {
        uppy.setFileMeta(file.id, {
            name: file.name,
        });
    });*/

    // @ts-ignore
  /*  uppy.off("upload", null).on('upload', (result) => {

        for (let i = 0; i < result.fileIDs.length; i++) {
            let fileID = result.fileIDs[i];
            const file = uppy.getFile(fileID);
            uppy.setFileState(fileID, {
                xhrUpload: {
                  //  ...file.xhrUpload,
                    formData: true,
                    fieldName: "document",
                    endpoint: `http://localhost:8095/api/v1/mappingExecution/${mappingId}`
                }
            })
        }
    });*/


    //add completed handler
    // @ts-ignore
    uppy.off("complete", null).on('complete', (result) => {
        uppy.close();
        const successful = result.successful.length;
        const failed = result.failed.length;
        if(failed > 0) {
            toast.error(`Failed to upload ${failed} file(s).`);
        }

        toast.success(`Successfully uploaded ${successful} file(s).`,{
        });
    });
}
