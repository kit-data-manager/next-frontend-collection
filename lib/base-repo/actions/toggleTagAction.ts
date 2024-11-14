import {Action, REPO_ACTIONS} from "@/lib/base-repo/actions/action";
import {toast} from "react-toastify";

export class ToggleTagAction extends Action {
    constructor(resourceId: string, filename: string, tag?: string) {
        if (tag) {
            super(`${REPO_ACTIONS.TOGGLE_TAG}_${resourceId}_${filename.replace(/_/g, '%5F')}_${tag.replace(/_/g, '%5F')}`, "", "", "");
        } else {
            super(`${REPO_ACTIONS.TOGGLE_TAG}_${resourceId}_${filename.replace(/_/g, '%5F')}`, "", "", "");
        }
    }

    public getActionIdentifier() {
        return this.getActionId();
    }

    public static async performAction(identifier: string, filename: string, etag: string, redirect?: Function) {
        const id = toast.loading("Updating tags...");
        const filename_decoded = filename.replace(/%5F/g, '_');
        const etag_decoded = etag.replace(/%5F/g, '_');

        await fetch(`/api/toggleTag?resourceId=${identifier}&path=${filename_decoded}&tag=${etag_decoded}`, {
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
