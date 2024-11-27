import {REPO_ACTIONS} from "@/lib/base-repo/actions/action";
import {ViewResourceAction} from "@/lib/base-repo/actions/viewResourceAction";
import {DeleteContentAction} from "@/lib/base-repo/actions/deleteContentAction";
import {EditResourceAction} from "@/lib/base-repo/actions/editResourceAction";
import {RevokeResourceAction} from "@/lib/base-repo/actions/revokeResourceAction";
import {DeleteResourceAction} from "@/lib/base-repo/actions/deleteResourceAction";
import {ToggleThumbAction} from "@/lib/base-repo/actions/toggleThumbAction";
import {ToggleTagAction} from "@/lib/base-repo/actions/toggleTagAction";

export function runAction(actionId:string, redirect?: Function){
    let parts:string[] = actionId.split("_");
switch(parts[0]){
    case REPO_ACTIONS.VIEW_RESOURCE:{
        ViewResourceAction.performAction(parts[1], undefined, undefined, redirect);
        break;
    }
    case REPO_ACTIONS.DELETE_CONTENT:{
        DeleteContentAction.performAction(parts[1], parts[2], undefined, redirect);
        break;
    }
    case REPO_ACTIONS.EDIT_RESOURCE:{
        EditResourceAction.performAction(parts[1], undefined, undefined, redirect);
        break;
    }
    case REPO_ACTIONS.REVOKE_RESOURCE:{
        console.log("Perform revoke action");
        RevokeResourceAction.performAction(parts[1], undefined, parts[2], redirect);
        break;
    }
    case REPO_ACTIONS.DELETE_RESOURCE:{
        DeleteResourceAction.performAction(parts[1], undefined, parts[2], redirect);
        break;
    }
    case REPO_ACTIONS.TOGGLE_THUMB:{
        ToggleThumbAction.performAction(parts[1], parts[2], undefined, redirect);
        break;
    }
    case REPO_ACTIONS.TOGGLE_TAG:{
        ToggleTagAction.performAction(parts[1], parts[2], parts[3], redirect);
        break;
    }


}
}
