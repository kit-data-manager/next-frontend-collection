import {toast} from "react-toastify";
import {Acl, DataResource} from "@/lib/definitions";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import {createDataResource, updateDataResource} from "@/lib/base-repo/client_data";
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
        title: "Administrate",
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

export const DoUpdatePermissions = (currentData: DataResource, etag:string, permissions:Element[], router: AppRouterInstance) => {
    console.log("Doing update ", permissions);

    permissions.map((permission) => {
        if(permission.columnId != "users"){
            //permission assigned
            const existingIndex:number | undefined = currentData.acls.findIndex((entry, index) => entry.sid === permission.id);
            if(existingIndex && currentData.acls[existingIndex].permission != permission.columnId){
                console.log("UPDATE ", permission);
            }else if(existingIndex){
                console.log("NO Update ", permission);
            }else{
                console.log("New Entry ", permission);
            }

        }
    })

    //go through all elements
    //get element.id permission in currentData.acls
    //if undefined -> remember for add
    //if different -> patch update

    //add patches for add

    //submit patches
}

export const DoUpdateDataResource = (currentData: DataResource, etag:string, router: AppRouterInstance) => {
    const id = toast.loading("Updating resource...")

    updateDataResource(currentData, etag ? etag : '').then((status) => {
        toast.update(id, {
            render: "Resource updated.", type: "success", isLoading: false, autoClose: 1000,
            "onClose": () => {
                router.push(`/base-repo/resources/${currentData.id}/edit?target=metadata`);
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
