import {toast} from "react-toastify";
import {Acl, DataResource} from "@/lib/definitions";
import type {Element} from "@/components/KanbanBoard/BoardCard";
import {stringToPermission} from "@/lib/general/permission-utils";
import {updateMetadataRecord} from "@/lib/metastore/client-data";

export const DoUpdatePermissions = (currentData: DataResource, etag: string, permissions: Element[], accessToken?: string, reloadCallback?: Function) => {
    const id = toast.loading("Processing permission update...")

    //go through all permissions and identify additions, updates, and removals
    let new_permissions: Acl[] = [];

    permissions.map((permission) => {
        //permission assigned
        const existingIndex: number | undefined = currentData.acls.findIndex((entry, index) => entry.sid === permission.id);

        if (existingIndex >= 0 && permission.columnId === "users") {
            //entry is in current ACL but now in 'users' column -> fully revoke
        } else if (existingIndex >= 0 && permission.columnId != "users") {
            //entry is in current ACL and has to be added, also updates will be applied here
            new_permissions.push({
                id: currentData.acls[existingIndex].id,
                sid: permission.id,
                permission: stringToPermission(permission.columnId.toString().toUpperCase())
            } as Acl);
        } else if (existingIndex < 0 && permission.columnId != "users") {
            //entry is not yet in ACL and not in 'users' column -> add new
            new_permissions.push({
                sid: permission.id,
                permission: stringToPermission(permission.columnId.toString().toUpperCase())
            } as Acl);
        }
    })
    console.log("New permissions ", new_permissions);
    currentData.acls = new_permissions;

    updateMetadataRecord("document", currentData, etag, accessToken).then((status) => {
        if (status === 200) {
            toast.update(id, {
                render: `Updates successfully applied.`,
                type: "success",
                isLoading: false,
                autoClose: 1000,
                "onClose": () => {
                    if (reloadCallback) {
                        reloadCallback(`/metastore/metadata/${currentData.id}/edit?target=access`);
                    }
                }
            });
        } else {
            console.error(`Unexpected response ${status} while patching metadata.`);
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

export const DoUpdateMetadata = (currentData: DataResource, etag: string, reloadCallback: Function, accessToken?: string | undefined) => {
    const id = toast.loading("Updating metadata...")

    updateMetadataRecord("document", currentData, etag, accessToken).then((status) => {
        toast.update(id, {
            render: "Resource updated.", type: "success", isLoading: false, autoClose: 1000,
            "onClose": () => {
                reloadCallback(`/metastore/metadata/${currentData.id}/edit?target=metadata`);
            }
        });
    }).catch(error => {
        console.error("Failed to update metadata.", error);
        toast.update(id, {
            render: `Failed to update metadata. Status: ${error.response.status}`,
            type: "error",
            isLoading: false
        });
    });
}
