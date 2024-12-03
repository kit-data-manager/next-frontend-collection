import {Action, REPO_ACTIONS} from "@/lib/base-repo/actions/action";

export class QuickShareResourceAction extends Action{
    constructor(resourceId:string) {
        super(`${REPO_ACTIONS.QUICK_SHARE}_${resourceId}`, "QuickShare", "solar:share-outline", 'QuickShare Resource');
    }

    public static async performAction(identifier: string, filename?:string, etag?:string, redirect?: Function){
        if(redirect) {
            redirect(`/base-repo/resources/`);
        }else{
            console.error("Redirect function missing.");
        }
    }
}
