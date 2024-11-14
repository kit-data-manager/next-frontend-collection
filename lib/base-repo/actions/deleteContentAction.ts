import {Action, REPO_ACTIONS} from "@/lib/base-repo/actions/action";
import {toast} from "react-toastify";

export class DeleteContentAction extends Action{
    constructor(resourceId:string, filename:string) {
        super(`${REPO_ACTIONS.DELETE_CONTENT}_${resourceId}_${filename.replace(/_/g, '%5F')}`, "Delete", "material-symbols-light:skull-outline", 'Delete File');
    }

    public static async performAction(identifier: string, filename: string, etag?:string, redirect?: Function){
        const id = toast.loading("Deleting content...")
        const filename_decoded = filename.replace(/%5F/g, '_');
        if (window.confirm(`Do you really want to delete the file ${filename_decoded}?`)) {
            await fetch(`/api/delete?resourceId=${identifier}&filename=${filename_decoded}`).then(response => {
                if(response.status === 204){
                    toast.update(id, {
                        render: `Content ${filename_decoded} successfully deleted.`,
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
