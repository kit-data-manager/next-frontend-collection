import {METASTORE_ACTIONS} from "@/lib/metastore/actions/action";
import {ViewSchemaAction} from "@/lib/metastore/actions/viewSchemaAction";
import {ViewMetadataAction} from "@/lib/metastore/actions/viewMetadataAction";
import {EditSchemaAction} from "@/lib/metastore/actions/editSchemaAction";
import {EditMetadataAction} from "@/lib/metastore/actions/editMetadataAction";
import {REPO_ACTIONS} from "@/lib/base-repo/actions/action";
import {QuickShareResourceAction} from "@/lib/base-repo/actions/quickShareResourceAction";

export function runAction(actionId:string, redirect?: Function){
    let action:string = actionId.substring(0, actionId.indexOf("_"));
    let identifier:string = actionId.substring(actionId.indexOf("_")+1);


switch(action){
    case METASTORE_ACTIONS.VIEW_SCHEMA:{
        ViewSchemaAction.performAction(identifier, undefined, undefined, redirect);
        break;
    }
    case  METASTORE_ACTIONS.VIEW_METADATA:{
        ViewMetadataAction.performAction(identifier, undefined, undefined, redirect);
        break;
    }
    case  METASTORE_ACTIONS.EDIT_SCHEMA:{
        EditSchemaAction.performAction(identifier, undefined, undefined, redirect);
        break;
    }
    case  METASTORE_ACTIONS.EDIT_METADATA:{
        EditMetadataAction.performAction(identifier, undefined, undefined, redirect);
        break;
    }
    case  METASTORE_ACTIONS.REVOKE_SCHEMA:{
       // DeleteResourceAction.performAction(parts[1], undefined, parts[2], redirect);
        break;
    }
    case  METASTORE_ACTIONS.REVOKE_METADATA:{
        //ToggleThumbAction.performAction(parts[1], parts[2], undefined, redirect);
        break;
    }
    case  METASTORE_ACTIONS.DELETE_SCHEMA:{
       // ToggleTagAction.performAction(parts[1], parts[2], parts[3], redirect);
        break;
    }
    case  METASTORE_ACTIONS.DELETE_METADATA:{
       // QuickShareResourceAction.performAction(parts[1],undefined, undefined, redirect);
        break;
    }
    case  REPO_ACTIONS.QUICK_SHARE:{
        QuickShareResourceAction.performAction(identifier,undefined, undefined, redirect);
        break;
    }



}
}
