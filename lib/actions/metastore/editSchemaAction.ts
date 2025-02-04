import {Action, METASTORE_ACTIONS} from "@/lib/actions/action";

export class EditSchemaAction extends Action{
    constructor(resourceId:string) {
        super(`${METASTORE_ACTIONS.EDIT_SCHEMA}_${resourceId.replace(/_/g, '%5F')}`, "Edit", "material-symbols-light:edit-square-outline", 'Edit Schema');
    }

    public static async performAction(actionId:string, accessToken?: string|undefined, redirect?: (redirectTarget:string) => void): Promise<void> {
        let parts: string[] = actionId.split("_");
        const identifier = parts[1].replace(/%5F/g, '_');

        if(redirect) {
            redirect(`/metastore/schemas/${identifier}/edit?target=metadata`);
        }else{
            console.error("Redirect function missing.");
        }
    }
}
