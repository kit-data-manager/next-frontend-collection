import {Action, METASTORE_ACTIONS} from "@/lib/actions/action";

export class QuickShareMetadataDocumentAction extends Action{
    constructor(resourceId:string) {
        super(`${METASTORE_ACTIONS.QUICK_SHARE_METADATA}_${resourceId}`, "QuickShare", "solar:share-outline", 'QuickShare Metadata');
    }

    public static async performAction(actionId:string, accessToken?: string|undefined, callback?: (redirectTarget:string) => void){
        if(callback) {
            callback(`/metadata/metadata/`);
        }else{
            console.error("Redirect function missing.");
        }
    }
}
