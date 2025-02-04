import {Action, METASTORE_ACTIONS, REPO_ACTIONS} from "@/lib/actions/action";
import {toast} from "react-toastify";

export class RevokeSchemaAction extends Action{
    constructor(resourceId:string, etag:string) {
        super(`${METASTORE_ACTIONS.REVOKE_SCHEMA}_${resourceId.replace(/_/g, '%5F')}_${etag}`, "Revoke", "material-symbols-light:delete-outline", 'Revoke Schema');
    }

    public static async performAction(actionId:string, accessToken?: string|undefined, redirect?: (redirectTarget:string) => void){

        let parts: string[] = actionId.split("_");
        const identifier = parts[1].replace(/%5F/g, '_');
        const etag = parts[2];

        const baseUrl: string = (process.env.NEXT_PUBLIC_METASTORE_BASE_URL ? process.env.NEXT_PUBLIC_METASTORE_BASE_URL : "http://localhost:8040");

        const headers = {
            "If-Match": etag
        };

        if (accessToken) {
            headers["Authorization"] = `Bearer ${accessToken}`;
        }

        if (window.confirm(`Do you really want to revoke schema ${identifier}?`)) {
            const id = toast.loading("Revoking schema...");

            await fetch(`${baseUrl}/api/v2/schemas/${identifier}`, {
                method: "DELETE",
                headers: headers
            }).then(response => {
                if(response.status === 204){
                    toast.update(id, {
                        render: `Schema ${identifier} successfully revoked.`,
                        type: "success",
                        isLoading: false,
                        autoClose: 1000,
                        "onClose": () => {
                            if(redirect){
                            redirect(`/metastore/schemas/${identifier}/view`);
                            }else{
                                console.error("Redirect function missing.");
                            }
                        }
                    });
                }else{
                    toast.update(id, {
                        render: `Failed to revoke schema. Status: ${response.status}`,
                        type: "error",
                        closeButton: true,
                        isLoading: false
                    });
                }
            }).catch(error => {
                console.error("Failed to revoke schema.", error);
                toast.update(id, {
                    render: `Failed to revoke schema. Status: ${error.response.status}`,
                    type: "error",
                    closeButton: true,
                    isLoading: false
                });
            });
        }
    }
}
