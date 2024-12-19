import {ActionButtonInterface} from "@/app/base-repo/components/DataResourceCard/DataResourceCard.d";

export const enum METASTORE_ACTIONS {
    "VIEW_SCHEMA" = "viewSchema",
    "VIEW_METADATA" = "viewMetadata",
    "EDIT_SCHEMA" = "editSchema",
    "EDIT_METADATA" = "editMetadata",
    "REVOKE_SCHEMA" = "revokeSchema",
    "REVOKE_METADATA" = "revokeMetadata",
    "DELETE_SCHEMA" = "deleteSchema",
    "DELETE_METADATA" = "deleteMetadata",
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
