import {Action, METASTORE_ACTIONS, REPO_ACTIONS} from "@/lib/actions/action";

export class QuickShareSchemaAction extends Action{
    constructor(resourceId:string) {
        super(`${METASTORE_ACTIONS.QUICK_SHARE_SCHEMA}_${resourceId}`, "QuickShare", "solar:share-outline", 'QuickShare Schema');
    }

    public static async performAction(actionId:string, accessToken?: string|undefined, callback?: (redirectTarget:string) => void){
        if(callback) {
            callback(`/metadata/schemas/`);
        }else{
            console.error("Redirect function missing.");
        }
    }
}
