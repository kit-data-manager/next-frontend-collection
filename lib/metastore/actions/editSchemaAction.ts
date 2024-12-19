import {Action, REPO_ACTIONS} from "@/lib/base-repo/actions/action";
import {METASTORE_ACTIONS} from "@/lib/metastore/actions/action";

export class EditSchemaAction extends Action{
    constructor(resourceId:string) {
        super(`${METASTORE_ACTIONS.EDIT_SCHEMA}_${resourceId}`, "Edit", "material-symbols-light:edit-square-outline", 'Edit Schema');
    }

    public static async performAction(identifier: string, filename?:string, etag?:string, redirect?: Function){
        if(redirect) {
            redirect(`/metastore/schemas/${identifier}/edit`);
        }else{
            console.error("Redirect function missing.");
        }
    }
}
