import {Action, REPO_ACTIONS} from "@/lib/actions/action";
import {toast} from "react-toastify";

export class RevokeResourceAction extends Action{
    constructor(resourceId:string, etag:string) {
        super(`${REPO_ACTIONS.REVOKE_RESOURCE}_${resourceId}_${etag}`, "Revoke", "material-symbols-light:delete-outline", 'Revoke Resource');
    }

    public static async performAction(actionId:string, accessToken?: string|undefined, redirect?: (redirectTarget:string) => void){
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

        if (window.confirm(`Do you really want to revoke resource ${identifier}?`)) {
            const id = toast.loading("Revoking resource...");
            await fetch(`${baseUrl}/api/v1/dataresources/${identifier}`, {
                method: "DELETE",
                headers: headers
            }).then(response => {
                if(response.status === 204){
                    toast.update(id, {
                        render: `Resource ${identifier} successfully revoked.`,
                        type: "success",
                        isLoading: false,
                        autoClose: 1000,
                        "onClose": () => {
                            if(redirect){
                            redirect(`/base-repo/resources/${identifier}/view`);
                            }else{
                                console.error("Redirect function missing.");
                            }
                        }
                    });
                }else{
                    toast.update(id, {
                        render: `Failed to revoke resource. Status: ${response.status}`,
                        type: "error",
                        closeButton: true,
                        isLoading: false
                    });
                }
            }).catch(error => {
                console.error("Failed to revoke resource.", error);
                toast.update(id, {
                    render: `Failed to revoke resource. Status: ${error.response.status}`,
                    type: "error",
                    closeButton: true,
                    isLoading: false
                });
            });
        }
    }
}
