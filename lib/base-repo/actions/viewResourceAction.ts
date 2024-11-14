import {Action, REPO_ACTIONS} from "@/lib/base-repo/actions/action";

export class ViewResourceAction extends Action{
    constructor(resourceId:string) {
        super(`${REPO_ACTIONS.VIEW_RESOURCE}_${resourceId}`, "View", "material-symbols-light:eye-tracking-outline", 'View Resource');
    }

    public static async performAction(identifier: string, filename?:string, etag?:string, redirect?: Function){
        if(redirect) {
            redirect(`/base-repo/resources/${identifier}/view`);
        }else{
            console.error("Redirect function missing.");
        }
    }
}
