import {
    assignTagToContent,
    createDataResource,
    deleteContent,
    removeTagFromContent,
    updateDataResource
} from "@/lib/base-repo/client-utils";
import {toast} from "react-toastify";
import {ContentInformation, DataResource} from "@/lib/definitions";
import {REPO_EVENTS} from "@/lib/event-utils";
import {AppRouterInstance} from "next/dist/shared/lib/app-router-context.shared-runtime";
import {ActionEvent, DataCardCustomEvent} from "../../../../../data-view-web-component";

export const DataChanged = (data: object, setConfirm: Function, setCurrentData: Function) => {
    if (!data) {
        setConfirm(false);
    } else {
        setCurrentData(data);
        setConfirm(true);
    }
}

export const DoUpdateDataResource = (etag: string, currentData: DataResource, router: AppRouterInstance) => {
    const redirectPath = `/base-repo/resources/${currentData.id}/view`;
    updateDataResource(currentData, etag).then((status) => {
        if (status == 200) {
            toast.success("Resource successfully updated.", {
                "onClose": () => {
                    router.push(redirectPath);
                    router.refresh();
                }
            });
        } else {
            toast.error("Failed to update resource. Status: " + status);
        }
    })
}

export const DoCreateDataResource = (currentData: DataResource, router: AppRouterInstance) => {
    const id = toast.loading("Creating resource...")

    createDataResource(currentData).then((response) => {
        if (response.status == 201) {
            return response.json();
        } else {
            toast.update(id, {render: "Failed to create resource.", type: "error", isLoading: false});
            Promise.reject("Failed to create resource.");
        }
    }).then(json => {
        toast.update(id, {
            render: "Resource created.", type: "success", isLoading: false, autoClose: 3000,
            "onClose": () => {
                const redirectPath = `/base-repo/resources/${json.id}/edit`;
                router.push(redirectPath);
                router.refresh();
            }
        });
    })
}

export const HandleEditorAction = (event: DataCardCustomEvent<ActionEvent>,
                                   currentData: DataResource,
                                   currentContent: Array<ContentInformation>,
                                   path: string | null,
                                   setOpenModal: Function,
                                   setActionContent: Function,
                                   accessToken?: string) => {

    const eventIdentifier: string = event.detail.eventIdentifier;
    let parts = eventIdentifier.split("_");
    const contentPath = eventIdentifier.substring(eventIdentifier.indexOf("_") + 1);

    const selectedContent: ContentInformation | undefined = currentContent.find((element) => element.relativePath === contentPath);

    if (selectedContent) {
        const redirectPath = `/base-repo/resources/${currentData.id}/edit`;

        if (parts[0] === REPO_EVENTS.DELETE_CONTENT) {
            if (window.confirm("Do you really want to delete the file " + selectedContent.relativePath + "?")) {
                deleteContent(selectedContent, redirectPath, accessToken).then(status => {
                    if (status == 204) {
                        toast.success("Content " + selectedContent.relativePath + " successfully removed.", {
                            "onClose": () => {
                                if (redirectPath) {
                                    //reload page after 3 seconds wait
                                    window.document.location = redirectPath;
                                }
                            }
                        });
                    } else {
                        toast.error("Failed to remove content. Status: " + status);
                    }
                })
            }
        } else if (parts[0] === "unmakeThumb") {
            removeTagFromContent(selectedContent, "thumb", accessToken);
        } else if (parts[0] === "makeThumb") {
            //otherwise, handle add/remove thumb event
            currentContent.forEach((element: ContentInformation) => {
                removeTagFromContent(element, "thumb", accessToken);
            });
            assignTagToContent(selectedContent, "thumb", path, accessToken);
        } else if (parts[0] === "addTag") {
            console.log("ADD TAG");
            setActionContent(parts[1]);
            setOpenModal(true);
        }
    }
};
