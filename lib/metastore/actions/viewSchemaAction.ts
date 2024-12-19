import {Action, REPO_ACTIONS} from "@/lib/base-repo/actions/action";
import {METASTORE_ACTIONS} from "@/lib/metastore/actions/action";

export class ViewSchemaAction extends Action{
    constructor(resourceId:string) {
        super(`${METASTORE_ACTIONS.VIEW_SCHEMA}_${resourceId}`, "View", "material-symbols-light:eye-tracking-outline", 'View Schema');
    }

    public static async performAction(identifier: string, filename?:string, etag?:string, redirect?: Function){
        if(redirect) {
            redirect(`/metastore/schemas/${identifier}/view`);
        }else{
            console.error("Redirect function missing.");
        }
    }
}
