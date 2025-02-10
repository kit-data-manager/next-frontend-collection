import {DataResource, Permission, State} from "@/lib/definitions";
import {permissionToNumber, resourcePermissionForUser} from "@/lib/general/permission-utils";

export const enum REPO_EVENTS {
    "VIEW_RESOURCE" = "viewResource",
    "EDIT_RESOURCE" = "editResource"
}

export const viewEventIdentifier = (resourceId: string): string => {
    return `${REPO_EVENTS.VIEW_RESOURCE}_${resourceId}`;
}

export const editEventIdentifier = (resourceId: string): string => {
    return `${REPO_EVENTS.EDIT_RESOURCE}_${resourceId}`;
}

export const downloadEventIdentifier = (resourceId: string): string => {
    return `/api/base-repo/download?resourceId=${resourceId}&type=zip`;
}

export function userCanView(resource: DataResource, userId: string | undefined, groups: string[] | undefined): boolean {
    let permission: 0 | 1 | 2 | 3 = resourcePermissionForUser(resource, userId, groups);
    switch (resource.state) {
        case State.VOLATILE:
        case State.FIXED:
            return permission > permissionToNumber(Permission.NONE);
        case State.REVOKED:
        case State.GONE:
            return permission > permissionToNumber(Permission.WRITE);
        default:
            //Permission.NONE
            return false;
    }
}

export function userCanEdit(resource: DataResource, userId: string | undefined, groups: string[] | undefined): boolean {
    let permission: 0 | 1 | 2 | 3 = resourcePermissionForUser(resource, userId, groups);

    switch (resource.state) {
        case State.VOLATILE:
            return permission >= permissionToNumber(Permission.WRITE);
        case State.FIXED:
        case State.REVOKED:
            return permission >= permissionToNumber(Permission.ADMINISTRATE);
        default:
            //Permission.NONE || Permission.READ || State.GONE
            return false;
    }
}

export function userCanDownload(resource: DataResource, userId: string | undefined, groups: string[] | undefined): boolean {
    let permission: 0 | 1 | 2 | 3 = resourcePermissionForUser(resource, userId, groups);
    switch (resource.state) {
        case State.VOLATILE:
        case State.FIXED:
            return permission > permissionToNumber(Permission.NONE);
        case State.REVOKED:
            return permission > permissionToNumber(Permission.WRITE);
        default:
            //Permission.NONE || State.GONE
            return false;
    }
}

export function userCanDelete(resource: DataResource, userId: string | undefined, groups: string[] | undefined): boolean {
    let permission: 0 | 1 | 2 | 3 = resourcePermissionForUser(resource, userId, groups);
    switch (resource.state) {
        case State.VOLATILE:
        case State.FIXED:
        case State.REVOKED:
            return permission > permissionToNumber(Permission.WRITE);
        default:
            //Permission.NONE || Permission.READ || Permission.WRITE || State.GONE
            return false;
    }
}
