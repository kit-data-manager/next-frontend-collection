import {Action, REPO_ACTIONS} from "@/lib/base-repo/actions/action";

export class EditResourceAction extends Action{
    constructor(resourceId:string) {
        super(`${REPO_ACTIONS.EDIT_RESOURCE}_${resourceId}`, "Edit", "material-symbols-light:edit-square-outline", 'Edit Resource');
    }

    public static async performAction(identifier: string, filename?:string, etag?:string, redirect?: Function){
        if(redirect) {
            redirect(`/base-repo/resources/${identifier}/edit`);
        }else{
            console.error("Redirect function missing.");
        }
    }
}
