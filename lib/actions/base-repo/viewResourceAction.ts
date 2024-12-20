import {Action, REPO_ACTIONS} from "@/lib/actions/action";

export class ViewResourceAction extends Action{
    constructor(resourceId:string) {
        super(`${REPO_ACTIONS.VIEW_RESOURCE}_${resourceId}`, "View", "material-symbols-light:eye-tracking-outline", 'View Resource');
    }

    public static async performAction(actionId:string, redirect?: Function){
        let parts: string[] = actionId.split("_");
        const identifier = parts[1];

        if(redirect) {
            redirect(`/base-repo/resources/${identifier}/view`);
        }else{
            console.error("Redirect function missing.");
        }
    }
}
