import {toast} from "react-toastify";
import {DataResource} from "@/lib/definitions";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import {createDataResource, updateDataResource} from "@/lib/base-repo/client_data";

export const DataChanged = (data: object, setConfirm: Function, setCurrentData: Function) => {
    if (!data) {
        setConfirm(false);
    } else {
        setCurrentData(data);
        setConfirm(true);
    }
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
