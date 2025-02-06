import {toast} from "react-toastify";
import {Acl, DataResource} from "@/lib/definitions";
import type {Element} from "@/components/KanbanBoard/BoardCard";
import {NestedColumn} from "@/components/KanbanBoard/KanbanBoard";
import {updateMetadataSchema} from "@/lib/metastore/client_data";
import {stringToPermission} from "@/lib/permission-utils";

export const accessControlColumns: NestedColumn[] = [
    {
        id: "users",
        title: "Users",
        icon: "gridicons:multiple-users"
    },
    {
        id: "read",
        title: "Read",
        icon: "material-symbols-light:eye-tracking-outline"
    },
    {
        id: "write",
        title: "Write",
        icon: "material-symbols-light:edit-square-outline"
    },
    {
        id: "administrate",
        title: "Owner",
        icon: "arcticons:vivo-i-manager"
    }
];

export const DataChanged = (data: object, setConfirm: Function, setCurrentData: Function) => {
    if (!data) {
        setConfirm(false);
    } else {
        setCurrentData(data);
        setConfirm(true);
    }
}

export const DoUpdatePermissions = (currentData: DataResource, etag: string, permissions: Element[], accessToken?: string, reloadCallback?: Function) => {
    const id = toast.loading("Processing permission update...")

    //go through all permissions and identify additions, updates, and removals
    let new_permissions: Acl[] = [];

    permissions.map((permission) => {
        //permission assigned
        const existingIndex: number | undefined = currentData.acls.findIndex((entry, index) => entry.sid === permission.id);

        if (existingIndex >= 0 && permission.columnId === "users") {
            //entry is in current ACL but now in 'users' column -> fully revoke
        } else if (existingIndex >= 0 && permission.columnId != "users" && currentData.acls[existingIndex].permission.toLowerCase() != permission.columnId) {
            //entry is in current ACL but now in another column than the permission indicates -> update
            new_permissions.push({
                id: existingIndex.toString(),
                sid: permission.id,
                permission: stringToPermission(permission.columnId.toString().toUpperCase())
            } as Acl);
        } else if (existingIndex < 0 && permission.columnId != "users") {
            //entry is not yet in ACL and not in 'users' column -> add new
            new_permissions.push({
                sid: permission.id,
                permission: stringToPermission(permission.columnId.toString().toUpperCase())
            } as Acl);
        }else{
            console.log("EXIST ", existingIndex);
            if(existingIndex != undefined && existingIndex > 0){
                new_permissions.push(currentData.acls[existingIndex]);
            }
        }
    })
    console.log("NEW ", new_permissions);
    currentData.acls = new_permissions;

    updateMetadataSchema(currentData, etag, accessToken).then((status) => {
        if (status === 200) {
            toast.update(id, {
                render: `Updates successfully applied.`,
                type: "success",
                isLoading: false,
                autoClose: 1000,
                "onClose": () => {
                    if (reloadCallback) {
                        reloadCallback(`/metastore/schemas/${currentData.id}/edit?target=access`);
                    }
                }
            });
        } else {
            console.error(`Unexpected response ${status} while patching schema.`);
            toast.update(id, {
                render: `Failed to update access permissions. Status: ${status}`,
                type: "error",
                isLoading: false
            });
        }
    }).catch(error => {
        console.error("Failed to update access permissions.", error);
        toast.update(id, {
            render: `Failed to update access permissions. Status: ${error.response?.status}`,
            type: "error",
            isLoading: false
        });
    });
}

export const DoUpdateSchema = (currentData: DataResource, etag: string, reloadCallback: Function, accessToken?: string | undefined) => {
    const id = toast.loading("Updating schema...")

    updateMetadataSchema(currentData, etag, accessToken).then((status) => {
        toast.update(id, {
            render: "Resource updated.", type: "success", isLoading: false, autoClose: 1000,
            "onClose": () => {
                reloadCallback(`/metastore/schemas/${currentData.id}/edit?target=metadata`);
            }
        });
    }).catch(error => {
        console.error("Failed to update schema.", error);
        toast.update(id, {
            render: `Failed to update schema. Status: ${error.response.status}`,
            type: "error",
            isLoading: false
        });
    });
}
