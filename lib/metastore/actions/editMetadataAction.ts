import {Action, REPO_ACTIONS} from "@/lib/base-repo/actions/action";
import {METASTORE_ACTIONS} from "@/lib/metastore/actions/action";

export class EditMetadataAction extends Action{
    constructor(resourceId:string) {
        super(`${METASTORE_ACTIONS.EDIT_METADATA}_${resourceId}`, "Edit", "material-symbols-light:edit-square-outline", 'Edit Metadata');
    }

    public static async performAction(identifier: string, filename?:string, etag?:string, redirect?: Function){
        if(redirect) {
            redirect(`/metastore/metadata/${identifier}/edit`);
        }else{
            console.error("Redirect function missing.");
        }
    }
}
