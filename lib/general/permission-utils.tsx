import {DataResource, Permission} from "@/lib/definitions";

/**
 * Obtain the numeric permission for the provided resource and userId. In addition, groups is checked for
 * ROLE_ADMINISTRATOR, which then overrides are user permissions. If userId has no administrator role, the function
 * will check all acl entries of the resource and returns either the specific permission for userId and if userId is
 * not in the acl, the permission for anonymousUser, which stands for public access. The function returns the numeric
 * permission which is one of 0|1|2|3.
 *
 * @param resource The resource to check.
 * @param userId The userId.
 * @param groups An array of groups userId is member of.
 */
export function resourcePermissionForUser(resource:DataResource, userId:string | undefined, groups: string[] | undefined):0|1|2|3{
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

/**
 * Transform a permission into its numeric representation. Returns a number of 0|1|2|3.
 *
 * @param permission The permission to transform.
 */
export function permissionToNumber(permission:Permission):0|1|2|3{
    switch(permission){
        case Permission.NONE:return 0;
        case Permission.READ: return 1;
        case Permission.WRITE:return 2;
        case Permission.ADMINISTRATE: return 3;
    }
}

/**
 * Transform a string into its matching Permission enum. Returns a Permission enum value.
 *
 * @param permissionString The permission as string.
 */
export function stringToPermission(permissionString:string):Permission{
    switch(permissionString){
        case "READ":
            return Permission.READ;
        case "WRITE":
            return Permission.WRITE;
        case "ADMINISTRATE":
            return Permission.ADMINISTRATE;
    }

    return Permission.NONE;
}
