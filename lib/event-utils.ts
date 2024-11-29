import {DataResource, Permission, State} from "@/lib/definitions";
import {resourcePermissionForUser} from "@/lib/permission-utils";

export const enum REPO_EVENTS {
    "VIEW_RESOURCE" = "viewResource",
    "EDIT_RESOURCE" = "editResource"
}

export const viewEventIdentifier = (resourceId:string) :string => {
    return `${REPO_EVENTS.VIEW_RESOURCE}_${resourceId}`;
}

export const editEventIdentifier = (resourceId:string) :string => {
    return `${REPO_EVENTS.EDIT_RESOURCE}_${resourceId}`;
}

export const downloadEventIdentifier = (resourceId:string) :string => {
    return `/api/download?resourceId=${resourceId}&type=zip`;
}

export function userCanView(resource: DataResource, userId: string | undefined, groups:string[] | undefined):boolean{
    let permission:Permission = resourcePermissionForUser(resource, userId, groups);
    switch(resource.state){
        case State.VOLATILE:
        case State.FIXED:
            return permission > Permission.NONE;
        case State.REVOKED:
        case State.GONE:
            return permission > Permission.WRITE;
        default:
            //Permission.NONE
            return false;
    }
}

export function userCanEdit(resource: DataResource, userId: string | undefined, groups:string[] | undefined):boolean{
    let permission:Permission = resourcePermissionForUser(resource, userId, groups);
    switch(resource.state){
        case State.VOLATILE:
            return permission > Permission.READ;
        case State.FIXED:
        case State.REVOKED:
            return permission > Permission.WRITE;
        default:
            //Permission.NONE || Permission.READ || State.GONE
            return false;
    }
}

export function userCanDownload(resource: DataResource, userId: string | undefined, groups:string[] | undefined):boolean{
    let permission:Permission = resourcePermissionForUser(resource, userId, groups);
    switch(resource.state){
        case State.VOLATILE:
        case State.FIXED:
            return permission > Permission.NONE;
        case State.REVOKED:
            return permission > Permission.WRITE;
        default:
            //Permission.NONE || State.GONE
            return false;
    }
}

export function userCanDelete(resource: DataResource, userId: string | undefined, groups:string[] | undefined):boolean{
    let permission:Permission = resourcePermissionForUser(resource, userId, groups);
    switch(resource.state){
        case State.VOLATILE:
        case State.FIXED:
        case State.REVOKED:
            return permission > Permission.WRITE;
        default:
            //Permission.NONE || Permission.READ || Permission.WRITE || State.GONE
            return false;
    }
}
