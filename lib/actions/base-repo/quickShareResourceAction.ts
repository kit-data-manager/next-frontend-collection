import {Action, REPO_ACTIONS} from "@/lib/actions/action";

export class QuickShareResourceAction extends Action{
    constructor(resourceId:string) {
        super(`${REPO_ACTIONS.QUICK_SHARE}_${resourceId}`, "QuickShare", "solar:share-outline", 'QuickShare Resource');
    }

    public static async performAction(actionId:string, accessToken?: string|undefined, callback?: (redirectTarget:string) => void){
        let parts: string[] = actionId.split("_");
        const identifier = parts[1];

        if(callback) {
            callback(`/base-repo/resources/`);
        }else{
            console.error("Redirect function missing.");
        }
    }
}
