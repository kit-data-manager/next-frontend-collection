import {METASTORE_ACTIONS, REPO_ACTIONS} from "@/lib/actions/action";
import {DeleteContentAction} from "@/lib/actions/base-repo/deleteContentAction";
import {EditResourceAction} from "@/lib/actions/base-repo/editResourceAction";
import {RevokeResourceAction} from "@/lib/actions/base-repo/revokeResourceAction";
import {DeleteResourceAction} from "@/lib/actions/base-repo/deleteResourceAction";
import {RemoveTagAction} from "@/lib/actions/base-repo/removeTagAction";
import {QuickShareResourceAction} from "@/lib/actions/base-repo/quickShareResourceAction";
import {ViewMetadataAction} from "@/lib/actions/metastore/viewMetadataAction";
import {ViewSchemaAction} from "@/lib/actions/metastore/viewSchemaAction";
import {EditSchemaAction} from "@/lib/actions/metastore/editSchemaAction";
import {EditMetadataAction} from "@/lib/actions/metastore/editMetadataAction";
import {ViewResourceAction} from "@/lib/actions/base-repo/viewResourceAction";
import {AddTagAction} from "@/lib/actions/base-repo/addTagAction";
import {RevokeSchemaAction} from "@/lib/actions/metastore/revokeSchemaAction";
import {DeleteSchemaAction} from "@/lib/actions/metastore/deleteSchemaAction";
import {QuickShareSchemaAction} from "@/lib/actions/metastore/quickShareSchemaAction";

let actionMapping: Map<string, (actionId: string, accessToken?: string|undefined, redirect?: (redirectTarget:string) => void) => void> = new Map();
//base-repo actions
actionMapping.set(REPO_ACTIONS.VIEW_RESOURCE, ViewResourceAction.performAction);
actionMapping.set(REPO_ACTIONS.DELETE_CONTENT, DeleteContentAction.performAction);
actionMapping.set(REPO_ACTIONS.EDIT_RESOURCE, EditResourceAction.performAction);
actionMapping.set(REPO_ACTIONS.REVOKE_RESOURCE, RevokeResourceAction.performAction);
actionMapping.set(REPO_ACTIONS.DELETE_RESOURCE, DeleteResourceAction.performAction);
actionMapping.set(REPO_ACTIONS.ADD_TAG, AddTagAction.performAction);
actionMapping.set(REPO_ACTIONS.REMOVE_TAG, RemoveTagAction.performAction);
actionMapping.set(REPO_ACTIONS.QUICK_SHARE, QuickShareResourceAction.performAction);

//metastore actions
actionMapping.set(METASTORE_ACTIONS.VIEW_SCHEMA, ViewSchemaAction.performAction);
actionMapping.set(METASTORE_ACTIONS.VIEW_METADATA, ViewMetadataAction.performAction);
actionMapping.set(METASTORE_ACTIONS.EDIT_SCHEMA, EditSchemaAction.performAction);
actionMapping.set(METASTORE_ACTIONS.EDIT_METADATA, EditMetadataAction.performAction);
actionMapping.set(METASTORE_ACTIONS.REVOKE_SCHEMA, RevokeSchemaAction.performAction);
actionMapping.set(METASTORE_ACTIONS.REVOKE_METADATA, dummy);
actionMapping.set(METASTORE_ACTIONS.DELETE_SCHEMA, DeleteSchemaAction.performAction);
actionMapping.set(METASTORE_ACTIONS.DELETE_METADATA, dummy);
actionMapping.set(METASTORE_ACTIONS.QUICK_SHARE_SCHEMA, QuickShareSchemaAction.performAction);
actionMapping.set(METASTORE_ACTIONS.QUICK_SHARE_METADATA, dummy);


function dummy(actionId: string, accessToken?: string|undefined, redirect?: (redirectTarget:string) => void) {
    console.log("DummyActionHandler ", actionId);
}

export function runAction(actionId: string, accessToken?: string | undefined, redirect?: (redirectTarget:string) => void) {
    let parts: string[] = actionId.split("_");

    actionMapping.forEach((value, key, map) => {
        if (key === parts[0]) {
            value.call(undefined, actionId, accessToken, redirect);
            return;
        }
    })

}
