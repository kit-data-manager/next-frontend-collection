import {Action, REPO_ACTIONS} from "@/lib/actions/action";
import {toast} from "react-toastify";
import {fetchWithBasePath} from "@/lib/utils";

export class ToggleThumbAction extends Action {
    constructor(resourceId: string, filename: string) {
        super(`${REPO_ACTIONS.TOGGLE_THUMB}_${resourceId}_${filename.replace(/_/g, '%5F')}`, "", "", "");
    }

    public getActionIdentifier() {
        return this.getActionId();
    }

    public static async performAction(actionId: string, redirect?: Function) {
        const id = toast.loading("Toggle thumb tag...");

        let parts: string[] = actionId.split("_");
        const identifier = parts[1];
        const filename = parts[2].replace(/%5F/g, '_');

        await fetchWithBasePath(`/api/base-repo/toggleTag?resourceId=${identifier}&path=${filename}&tag=thumb`, {
            method: "PATCH"
        }).then(response => {
            if (response.status === 204) {
                toast.update(id, {
                    render: `Thumb tag successfully toggled.`,
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
                    render: `Failed to toggle thumb tag. Status: ${response.status}`,
                    type: "error",
                    closeButton: true,
                    isLoading: false
                });
            }
        }).catch(error => {
            console.error("Failed to toggle thumb tag.", error);
            toast.update(id, {
                render: `Failed to toggle thumb tag. Status: ${error.response.status}`,
                type: "error",
                closeButton: true,
                isLoading: false
            });
        });
    }
}
