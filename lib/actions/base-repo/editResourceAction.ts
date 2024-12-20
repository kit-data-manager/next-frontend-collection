import {Action, REPO_ACTIONS} from "@/lib/actions/action";

export class EditResourceAction extends Action{
    constructor(resourceId:string) {
        super(`${REPO_ACTIONS.EDIT_RESOURCE}_${resourceId}`, "Edit", "material-symbols-light:edit-square-outline", 'Edit Resource');
    }

    public static async performAction(actionId:string, redirect?: Function){
        let parts: string[] = actionId.split("_");
        const identifier = parts[1];

        if(redirect) {
            redirect(`/base-repo/resources/${identifier}/edit`);
        }else{
            console.error("Redirect function missing.");
        }
    }
}
