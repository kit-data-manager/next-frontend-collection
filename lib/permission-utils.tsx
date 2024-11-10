import {Acl, DataResource, Permission, State} from "@/lib/definitions";

export function resourcePermissionForUser(resource:DataResource, userId:string | undefined, groups: string[] | undefined){
    if(groups?.find((group) => group == "ROLE_ADMINISTRATOR")){
        return Permission.ADMINISTRATE;
    }
    let userPermission: Permission = Permission.READ;
    resource.acls?.map((element: Acl, i:number) => {
        if(element.sid === "anonymousUser"){
            userPermission = element.permission;
        }else if(userId && element.sid === userId){
            return element.permission;
        }
    });

    return userPermission;
}
