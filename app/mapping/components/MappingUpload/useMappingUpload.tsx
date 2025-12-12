import {toast} from "react-toastify";
import Uppy from "@uppy/core";

export function installEventHandlers(uppy:Uppy, mappingId:string, mappingCallback:Function){
    //add completed handler
    // @ts-ignore
    uppy.off("complete", null).on('complete', (result) => {
        uppy.destroy();
        const successful = result.successful ? result.successful.length : 0;
        const failed = result.failed ? result.failed.length : 0;
        if(failed > 0) {
            toast.error(`Failed to upload ${failed} file(s).`);
        }

        toast.success(`Successfully uploaded ${successful} file(s).`,{
        });
    });
}
