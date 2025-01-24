import {Action, REPO_ACTIONS} from "@/lib/actions/action";
import {toast} from "react-toastify";

export class DeleteResourceAction extends Action{
    constructor(resourceId:string, etag:string) {
        super(`${REPO_ACTIONS.DELETE_RESOURCE}_${resourceId}_${etag}`, "Delete", "material-symbols-light:skull-outline", 'Delete Resource');
    }

    public static async performAction(actionId:string, accessToken?: string|undefined, redirect?: (redirectTarget:string) => void){
        const id = toast.loading("Deleting resource...")

        let parts: string[] = actionId.split("_");
        const identifier = parts[1];
        const etag = parts[2];

        const baseUrl: string = (process.env.NEXT_PUBLIC_REPO_BASE_URL ? process.env.NEXT_PUBLIC_REPO_BASE_URL : "http://localhost:8080");

        const headers = {
            "If-Match": etag
        };

        if (accessToken) {
            headers["Authorization"] = `Bearer ${accessToken}`;
        }

        if (window.confirm(`Do you really want to delete resource ${identifier}?`)) {
            await fetch(`${baseUrl}/api/v1/dataresources/${identifier}`, {
                method: "DELETE",
                headers: headers
            }).then(response => {
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
