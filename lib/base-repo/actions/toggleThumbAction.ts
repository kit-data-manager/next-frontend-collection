import {Action, REPO_ACTIONS} from "@/lib/base-repo/actions/action";
import {toast} from "react-toastify";
import {ResponseError} from "@/lib/base-repo/client_data";
import {fetchWithBasePath} from "@/lib/utils";

export class ToggleThumbAction extends Action{
    constructor(resourceId:string, filename:string) {
        super(`${REPO_ACTIONS.TOGGLE_THUMB}_${resourceId}_${filename.replace(/_/g, '%5F')}`, "", "", "");
    }

    public getActionIdentifier(){
        return this.getActionId();
    }

    public static async performAction(identifier: string, filename: string, etag?:string, redirect?: Function){
            const id = toast.loading("Toggle thumb tag...");
            const filename_decoded = filename.replace(/%5F/g, '_');

            await fetchWithBasePath(`/api/base-repo/toggleTag?resourceId=${identifier}&path=${filename_decoded}&tag=thumb`, {
                method: "PATCH"
            }).then(response => {
                if(response.status === 204){
                    toast.update(id, {
                        render: `Thumb tag successfully toggled.`,
                        type: "success",
                        isLoading: false,
                        autoClose: 1000,
                        "onClose": () => {
                            if(redirect){
                                redirect(`/base-repo/resources/${identifier}/edit?target=content`);
                            }else{
                                console.error("Redirect function missing.");
                            }
                        }
                    });
                }else{
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
