import {Action, METASTORE_ACTIONS} from "@/lib/actions/action";

export class ViewSchemaAction extends Action {
    constructor(resourceId: string) {
        super(`${METASTORE_ACTIONS.VIEW_SCHEMA}_${resourceId.replace(/_/g, '%5F')}`, "View", "material-symbols-light:eye-tracking-outline", 'View Schema');
    }

    public static async performAction(actionId: string, accessToken?: string|undefined, redirect?: (redirectTarget:string) => void) {
        let parts: string[] = actionId.split("_");
        const identifier = parts[1].replace(/%5F/g, '_');

        if (redirect) {
            redirect(`/metastore/schemas/${identifier}/view`);
        } else {
            console.error("Redirect function missing.");
        }
    }
}
