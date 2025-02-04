import {Action, REPO_ACTIONS} from "@/lib/actions/action";
import {toast} from "react-toastify";

export class DeleteContentAction extends Action {
    constructor(resourceId: string, filename: string, etag:string) {
        super(`${REPO_ACTIONS.DELETE_CONTENT}_${resourceId}_${filename.replace(/_/g, '%5F')}_${etag}`, "Delete", "material-symbols-light:skull-outline", 'Delete File');
    }

    public static async performAction(actionId: string, accessToken?: string|undefined, redirect?: (redirectTarget:string) => void) {
        let parts: string[] = actionId.split("_");
        const identifier = parts[1];
        const filename = parts[2].replace(/%5F/g, '_');
        const etag = parts[3];

        //require etag
        const baseUrl: string = (process.env.NEXT_PUBLIC_REPO_BASE_URL ? process.env.NEXT_PUBLIC_REPO_BASE_URL : "http://localhost:8080");

        const headers = {
            "If-Match": etag
        };

        if (accessToken) {
            headers["Authorization"] = `Bearer ${accessToken}`;
        }

        if (window.confirm(`Do you really want to delete the file ${filename}?`)) {
            const id = toast.loading("Deleting content...")
            await fetch(`${baseUrl}/api/v1/dataresources/${identifier}/data/${filename}`, {
                method: "DELETE",
                headers: headers
            }).then(response => {
                if (response.status === 204) {
                    toast.update(id, {
                        render: `Content ${filename} successfully deleted.`,
                        type: "success",
                        isLoading: false,
                        autoClose: 1000,
                        "onClose": () => {
                            if (redirect) {
                                redirect(`/base-repo/resources/${identifier}/edit?target=content`);
                            } else {
                                console.error("Redirect function missing.");
                            }
                        }
                    });
                } else {
                    toast.update(id, {
                        render: `Failed to delete content. Status: ${response.status}`,
                        type: "error",
                        closeButton: true,
                        isLoading: false
                    });
                }
            }).catch(() => {
                console.error("Failed to delete content.");
                toast.update(id, {
                    render: `Failed to delete content. Status: `,
                    type: "error",
                    closeButton: true,
                    isLoading: false
                });
            });
        }
    }

}
