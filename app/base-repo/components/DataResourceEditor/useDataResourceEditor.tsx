import {toast} from "react-toastify";
import {DataResource} from "@/lib/definitions";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import {createDataResource, patchDataResourceAcls, updateDataResource} from "@/lib/base-repo/client_data";
import type {Element} from "@/components/KanbanBoard/BoardCard";
import {NestedColumn} from "@/components/KanbanBoard/KanbanBoard";

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

export const DoUpdatePermissions = (currentData: DataResource, etag: string, permissions: Element[], reloadCallback:Function) => {
    const id = toast.loading("Processing permission update...")

    const additions: any[] = [];
    const updates: any[] = [];
    const removals: any[] = [];

    //go through all permissions and identify additions, updates, and removals
    permissions.map((permission) => {
        //permission assigned
        const existingIndex: number | undefined = currentData.acls.findIndex((entry, index) => entry.sid === permission.id);

        if (existingIndex >= 0 && permission.columnId === "users") {
            //entry is in current ACL but now in 'users' column -> fully revoke
            removals.push({
                "op": "remove",
                "path": `/acls/${existingIndex}`
            });
        } else if (existingIndex >= 0 && permission.columnId != "users" && currentData.acls[existingIndex].permission.toLowerCase() != permission.columnId) {
            //entry is in current ACL but now in another column than the permission indicates -> update
            updates.push({
                "op": "replace",
                "path": `/acls/${existingIndex}/permission`,
                value: permission.columnId.toString().toUpperCase()
            });
        } else if (existingIndex < 0 && permission.columnId != "users") {
            //entry is not yet in ACL and not in 'users' column -> add new
            additions.push({
                "op": "add",
                "path": `/acls/-`,
                value: {'sid': permission.id, 'permission': permission.columnId.toString().toUpperCase()}
            });
        }
    })

    //order single patches to avoid conflicts during patch (update > removal > add)
    const orderedPatches: any[] = [];
    orderedPatches.push(...updates);
    orderedPatches.push(...removals);
    orderedPatches.push(...additions);

    patchDataResourceAcls(currentData.id, etag, orderedPatches).then((status) => {
        if (status === 204) {
            toast.update(id, {
                render: `${orderedPatches.length} updates successfully applied.`,
                type: "success",
                isLoading: false,
                autoClose: 1000,
                "onClose": () => {
                    reloadCallback(`/base-repo/resources/${currentData.id}/edit?target=access`);
                }
            });
        }else{
            console.error(`Unexpected response ${status} while patching resource.`);
            toast.update(id, {
                render: `Failed to update access permissions. Status: ${status}`,
                type: "error",
                isLoading: false
            });
        }
    }).catch(error => {
        console.error("Failed to update access permissions.", error);
        toast.update(id, {
            render: `Failed to update access permissions. Status: ${error.response.status}`,
            type: "error",
            isLoading: false
        });
    });
}

export const DoUpdateDataResource = (currentData: DataResource, etag: string, reloadCallback:Function) => {
    const id = toast.loading("Updating resource...")

    updateDataResource(currentData, etag ? etag : '').then((status) => {
        toast.update(id, {
            render: "Resource updated.", type: "success", isLoading: false, autoClose: 1000,
            "onClose": () => {
                reloadCallback(`/base-repo/resources/${currentData.id}/edit?target=metadata`);
            }
        });
    }).catch(error => {
        console.error("Failed to update resource.", error);
        toast.update(id, {
            render: `Failed to update resource. Status: ${error.response.status}`,
            type: "error",
            isLoading: false
        });
    });
}

export const DoCreateDataResource = (currentData: DataResource, router: AppRouterInstance) => {
    const id = toast.loading("Creating resource...")
    createDataResource(currentData).then((json) => {
        toast.update(id, {
            render: "Resource created.", type: "success", isLoading: false, autoClose: 1000,
            "onClose": () => {
                router.push(`/base-repo/resources/${json.id}/edit`);
            }
        });

    }).catch(error => {
        console.error("Failed to create resource.", error);
        toast.update(id, {
            render: `Failed to create resource. Status: ${error.response.status}`,
            type: "error",
            isLoading: false
        });
    });
}
