import {Action, METASTORE_ACTIONS} from "@/lib/actions/action";

export class CreateMetadataAction extends Action {
    constructor(schemaId: string, schemaType:string, schemaVersion:string) {
        super(`${METASTORE_ACTIONS.CREATE_METADATA}_${schemaId.replace(/_/g, '%5F')}_${schemaType}_${schemaVersion}`, "Create", "material-symbols-light:new-window-sharp", 'Create Metadata');
    }

    public static async performAction(actionId: string, accessToken?: string|undefined, redirect?: (redirectTarget:string) => void) {
        let parts: string[] = actionId.split("_");
        const schemaId = parts[1].replace(/%5F/g, '_');
        const schemaType = parts[2];
        const schemaVersion = parts[3];

        if (redirect) {
            redirect(`/metastore/metadata/create?schemaId=${schemaId}&schemaType=${schemaType}&schemaVersion=${schemaVersion}`);
        } else {
            console.error("Redirect function missing.");
        }
    }
}
