import {Action, REPO_ACTIONS} from "@/lib/actions/action";
import {toast} from "react-toastify";
import {fetchWithBasePath} from "@/lib/utils";
import fetch from "node-fetch";

export class RevokeResourceAction extends Action{
    constructor(resourceId:string, etag:string) {
        super(`${REPO_ACTIONS.REVOKE_RESOURCE}_${resourceId}_${etag}`, "Revoke", "material-symbols-light:delete-outline", 'Revoke Resource');
    }

    public static async performAction(actionId:string, redirect?: Function){
        const id = toast.loading("Revoking resource...");

        let parts: string[] = actionId.split("_");
        const identifier = parts[1];
        const etag = parts[2];

        if (window.confirm(`Do you really want to revoke resource ${identifier}?`)) {
            await fetchWithBasePath(`/api/base-repo/delete?resourceId=${identifier}&etag=${etag}&type=revoke`).then(response => {
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
