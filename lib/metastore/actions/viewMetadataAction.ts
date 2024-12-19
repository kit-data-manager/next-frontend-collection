import {Action, REPO_ACTIONS} from "@/lib/base-repo/actions/action";
import {METASTORE_ACTIONS} from "@/lib/metastore/actions/action";

export class ViewMetadataAction extends Action{
    constructor(resourceId:string) {
        super(`${METASTORE_ACTIONS.VIEW_METADATA}_${resourceId}`, "View", "material-symbols-light:eye-tracking-outline", 'View Metadata');
    }

    public static async performAction(identifier: string, filename?:string, etag?:string, redirect?: Function){
        if(redirect) {
            redirect(`/metastore/metadata/${identifier}/view`);
        }else{
            console.error("Redirect function missing.");
        }
    }
}
