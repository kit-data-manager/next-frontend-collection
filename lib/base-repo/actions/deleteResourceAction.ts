import {Action, REPO_ACTIONS} from "@/lib/base-repo/actions/action";
import {toast} from "react-toastify";

export class DeleteResourceAction extends Action{
    constructor(resourceId:string, etag:string) {
        super(`${REPO_ACTIONS.DELETE_RESOURCE}_${resourceId}_${etag}`, "Delete", "material-symbols-light:skull-outline", 'Delete Resource');
    }

    public static async performAction(identifier: string, filename?: string, etag?:string, redirect?: Function){
        const id = toast.loading("Revoking resource...")
        if (window.confirm(`Do you really want to delete resource ${identifier}?`)) {
            await fetch(`/api/delete?resourceId=${identifier}&etag=${etag}&type=delete`).then(response => {
                if(response.status === 204){
                    toast.update(id, {
                        render: `Resource ${identifier} successfully deleted.`,
                        type: "success",
                        isLoading: false,
                        autoClose: 1000,
                        "onClose": () => {
                            if(redirect){
                                redirect(`/base-repo/resources/`);
                            }else{
                                console.error("Redirect function missing.");
                            }
                        }
                    });
                }else{
                    toast.update(id, {
                        render: `Failed to delete resource. Status: ${response.status}`,
                        type: "error",
                        closeButton: true,
                        isLoading: false
                    });
                }
            }).catch(error => {
                console.error("Failed to delete resource.", error);
                toast.update(id, {
                    render: `Failed to delete resource. Status: ${error.response.status}`,
                    type: "error",
                    closeButton: true,
                    isLoading: false
                });
            });
        }
    }

}
