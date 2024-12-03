import {ActionButtonInterface} from "@/app/base-repo/components/DataResourceCard/DataResourceCard.d";

export const enum REPO_ACTIONS {
    "VIEW_RESOURCE" = "viewResource",
    "EDIT_RESOURCE" = "editResource",
    "REVOKE_RESOURCE" = "revokeResource",
    "DELETE_RESOURCE" = "deleteResource",
    "DELETE_CONTENT" = "deleteContent",
    "TOGGLE_THUMB" = "toggleThumb",
    "TOGGLE_TAG" = "toggleTag",
    "QUICK_SHARE" = "quickShare"
}

export class Action {
    public isLink: boolean = false;

    constructor(private actionId: string, private label:string, private iconName:string, private tooltip:string) {}

    getDataCardAction():ActionButtonInterface{
        if(this.isLink){
            return {label: this.label, iconName:this.iconName, url: this.actionId, tooltip: this.tooltip} as ActionButtonInterface
        }else{
            return {label: this.label, iconName:this.iconName, eventIdentifier: this.actionId,  tooltip: this.tooltip}  as ActionButtonInterface
        }
    }

    getActionId(){
        return this.actionId;
    }

    public static async performAction(identifier: string, filename?:string, etag?:string, redirect?: Function){
        console.log("performAction not overwritten!");
    }

}
