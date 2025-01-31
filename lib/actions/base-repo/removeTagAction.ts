import {Action, REPO_ACTIONS} from "@/lib/actions/action";
import {toast} from "react-toastify";
import {fetchWithBasePath} from "@/lib/utils";

export class ToggleTagAction extends Action {
    constructor(resourceId: string, filename: string, etag:string, tag?: string) {
        if (tag) {
            super(`${REPO_ACTIONS.TOGGLE_TAG}_${resourceId}_${filename.replace(/_/g, '%5F')}_${etag}_${tag.replace(/_/g, '%5F')}`, "", "", "");
        } else {
            super(`${REPO_ACTIONS.TOGGLE_TAG}_${resourceId}_${filename.replace(/_/g, '%5F')}_${etag}`, "", "", "");
        }
    }

    public getActionIdentifier() {
        return this.getActionId();
    }

    public static async performAction(actionId: string, accessToken?: string|undefined, redirect?: (redirectTarget:string) => void) {
        const id = toast.loading("Updating tags...");
        let parts: string[] = actionId.split("_");
        const identifier = parts[1];
        const filename = parts[2].replace(/%5F/g, '_');
        const etag = parts[3];
        const tag = parts[4].replace(/%5F/g, '_');
        const baseUrl: string = (process.env.NEXT_PUBLIC_REPO_BASE_URL ? process.env.NEXT_PUBLIC_REPO_BASE_URL : "http://localhost:8080");

        const headers = {
            "If-Match": etag
        };

        if (accessToken) {
            headers["Authorization"] = `Bearer ${accessToken}`;
        }

        

        await fetchWithBasePath(`${baseUrl}/api/v1/dataresources/${identifier}/data/${filename}`, {
            method: "PATCH"
        }).then(response => {
            if (response.status === 204) {
                toast.update(id, {
                    render: `Tags successfully updated.`,
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
                    render: `Failed to update tags. Status: ${response.status}`,
                    type: "error",
                    closeButton: true,
                    isLoading: false
                });
            }
        }).catch(error => {
            console.error(`Failed to update tags.`, error);
            toast.update(id, {
                render: `Failed update tags. Status: ${error.response.status}`,
                type: "error",
                closeButton: true,
                isLoading: false
            });
        });
    }
}
