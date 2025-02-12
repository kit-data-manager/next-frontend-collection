import {Action, METASTORE_ACTIONS} from "@/lib/actions/action";

export class EditMetadataDocumentAction extends Action{
    constructor(resourceId:string) {
        super(`${METASTORE_ACTIONS.EDIT_METADATA}_${resourceId.replace(/_/g, '%5F')}`, "Edit", "material-symbols-light:edit-square-outline", 'Edit Metadata');
    }

    public static async performAction(actionId:string, accessToken?: string|undefined, redirect?: (redirectTarget:string) => void){
        let parts: string[] = actionId.split("_");
        const identifier = parts[1].replace(/%5F/g, '_');

        if(redirect) {
            redirect(`/metastore/metadata/${identifier}/edit?target=metadata`);
        }else{
            console.error("Redirect function missing.");
        }
    }
}
