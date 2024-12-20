import {Action, METASTORE_ACTIONS} from "@/lib/actions/action";

export class ViewMetadataAction extends Action{
    constructor(resourceId:string) {
        super(`${METASTORE_ACTIONS.VIEW_METADATA}_${resourceId.replace(/_/g, '%5F')}`, "View", "material-symbols-light:eye-tracking-outline", 'View Metadata');
    }

    public static async performAction(actionId:string, redirect?: Function){
        let parts: string[] = actionId.split("_");
        const identifier = parts[1].replace(/%5F/g, '_');

        if(redirect) {
            redirect(`/metastore/metadata/${identifier}/view`);
        }else{
            console.error("Redirect function missing.");
        }
    }
}
