import {Acl, DataResource, Permission} from "@/lib/definitions";

export function resourcePermissionForUser(resource:DataResource, userId:string | undefined, groups: string[] | undefined){
    if(groups?.find((group) => group == "ROLE_ADMINISTRATOR")) {
        return permissionToNumber(Permission.ADMINISTRATE);
    }

    let userPermission: Permission = Permission.NONE;

    const userAcl = resource.acls?.find(element => element.sid === userId);
    if(userAcl){
        userPermission = userAcl.permission;
    }else{
        const anonymousAcl = resource.acls?.find(element => element.sid === "anonymousUser");
        if(anonymousAcl){
            userPermission = anonymousAcl.permission;
        }
    }

    return permissionToNumber(userPermission);
}

export function permissionToNumber(permission:Permission){
    switch(permission){
        case Permission.NONE:return 0;
        case Permission.READ: return 1;
        case Permission.WRITE:return 2;
        case Permission.ADMINISTRATE: return 3;
    }
}
