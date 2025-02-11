import {toast} from "react-toastify";
import Uppy from "@uppy/core";

export function installEventHandlers(uppy:Uppy, mappingId:string, mappingCallback:Function){
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
