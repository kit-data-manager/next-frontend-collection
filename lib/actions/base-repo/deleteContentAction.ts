import {Action, REPO_ACTIONS} from "@/lib/actions/action";
import {toast} from "react-toastify";
import {fetchWithBasePath} from "@/lib/utils";

export class DeleteContentAction extends Action {
    constructor(resourceId: string, filename: string) {
        super(`${REPO_ACTIONS.DELETE_CONTENT}_${resourceId}_${filename.replace(/_/g, '%5F')}`, "Delete", "material-symbols-light:skull-outline", 'Delete File');
    }

    public static async performAction(actionId: string, redirect?: Function) {
        const id = toast.loading("Deleting content...")

        let parts: string[] = actionId.split("_");
        const identifier = parts[1];
        const filename = parts[2].replace(/%5F/g, '_');

        if (window.confirm(`Do you really want to delete the file ${filename}?`)) {
            await fetchWithBasePath(`/api/base-repo/delete?resourceId=${identifier}&filename=${filename}`).then(response => {
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
            }).finally(() => {
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
