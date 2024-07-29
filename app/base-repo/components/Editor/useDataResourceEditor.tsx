import {
    assignTagToContent,
    createDataResource,
    deleteContent,
    removeTagFromContent,
    updateDataResource
} from "@/lib/base-repo/client-utils";
import {toast} from "react-toastify";
import {ContentInformation} from "@/lib/definitions";
import {REPO_EVENTS} from "@/lib/event-utils";

export const DataChanged = (data:object, setConfirm, setCurrentData) =>{
    if(!data){
        setConfirm(false);
    }else {
        setCurrentData(data);
        setConfirm(true);
    }
}

export const DoUpdateDataResource = (etag: string, currentData, router) => {
    const redirectPath = `/base-repo/resources/${currentData.id}/view`;
    updateDataResource(currentData, etag).then((status) => {
        if(status == 200) {
            toast.success("Resource successfully updated.", {
                "onClose": () => {
                    router.push(redirectPath);
                    router.refresh();
                }
            });
        }else{
            toast.error("Failed to update resource. Status: " + status);
        }
    })
}

export const DoCreateDataResource = (currentData, router) => {
    const id = toast.loading("Creating resource...")

    createDataResource(currentData).then((response) => {
        if(response.status == 201) {
            return response.json();
        }else{
            toast.update(id, { render: "Failed to create resource.", type: "error", isLoading: false });
            Promise.reject("Failed to create resource.");
        }
    }).then(json => {
        toast.update(id, { render: "Resource created.", type: "success", isLoading: false, autoClose: 3000,
            "onClose": () => {
                const redirectPath = `/base-repo/resources/${json.id}/edit`;
                router.push(redirectPath);
                router.refresh();
            } });
    })
}

export const HandleEditorAction = (event, currentData, currentContent, path, router) => {
    const eventIdentifier:string = event.detail.eventIdentifier;
    let parts = eventIdentifier.split("_");
    const contentPath = eventIdentifier.substring(eventIdentifier.indexOf("_")+1);
    //const selectedContent: ContentInformation = currentContent[contentIndex];

    const selectedContent: ContentInformation = currentContent.find((element) => element.relativePath === contentPath);

    const redirectPath = `/base-repo/resources/${currentData.id}/edit`;

    if(parts[0] === REPO_EVENTS.DELETE_CONTENT){
        if(window.confirm("Do you really want to delete the file " + selectedContent.relativePath + "?")){
            deleteContent(selectedContent, redirectPath).then(status => {
                if(status == 204) {
                    toast.success("Content " + selectedContent.relativePath + " successfully removed.",{
                        "onClose": () =>{
                            if(redirectPath) {
                                //reload page after 3 seconds wait
                                window.document.location = redirectPath;
                            }
                        }
                    });
                }else{
                    toast.error("Failed to remove content. Status: " + status);
                }
            })
        }
    }else {
        //otherwise, handle add/remove thumb event
        currentContent.forEach((element: ContentInformation) => {
            removeTagFromContent(element, "thumb");
        });

        assignTagToContent(selectedContent, "thumb", path);
    }
};
