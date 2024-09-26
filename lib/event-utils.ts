import {ActionButtonInterface} from "@/app/base-repo/components/DataResourceCard/DataResourceCard.d";

const REPO_BASE_PATH = "/base-repo/resources/";
const VIEW_PATH = "view";
const EDIT_PATH = "edit";
const DOWNLOAD_RESOURCE_PATH = "download";
const EDIT_CONTENT_PATH = "edit_content?path=";
const DOWNLOAD_CONTENT_PATH = "download_content?path=";
const DELETE_CONTENT_PATH = "delete_content?path=";
export const enum REPO_EVENTS {
    "VIEW_RESOURCE" = "viewResource",
    "EDIT_RESOURCE" = "editResource",
    "DOWNLOAD_RESOURCE" = "downloadResource",
    "EDIT_CONTENT" = "editContent",
    "DOWNLOAD_CONTENT" = "downloadContent",
    "DELETE_CONTENT" = "deleteContent",
    "MAKE_THUMB" = "makeThumb",
    "UNMAKE_THUMB" = "unmakeThumb",
    "ADD_TAG" = "addTag",
}

export const eventIdentifierToPath = (eventIdentifier: string) => {

    let parts = eventIdentifier.split("_");

    switch (parts[0]) {
        case REPO_EVENTS.VIEW_RESOURCE:
            return `${REPO_BASE_PATH}${parts[1]}/${VIEW_PATH}`;
        case REPO_EVENTS.EDIT_RESOURCE:
            return `${REPO_BASE_PATH}${parts[1]}/${EDIT_PATH}`;
        case REPO_EVENTS.DOWNLOAD_RESOURCE:
            return `${REPO_BASE_PATH}${parts[1]}/${DOWNLOAD_RESOURCE_PATH}`;
        case REPO_EVENTS.EDIT_CONTENT:
            return `${REPO_BASE_PATH}${parts[1]}/${EDIT_CONTENT_PATH}${parts[2]}`;
        case REPO_EVENTS.DOWNLOAD_CONTENT:
            return `${REPO_BASE_PATH}${parts[1]}/${DOWNLOAD_CONTENT_PATH}${parts[2]}`;
        case REPO_EVENTS.DELETE_CONTENT:
            return `${REPO_BASE_PATH}${parts[1]}/${DELETE_CONTENT_PATH}${parts[2]}`;
        default:
            throw new Error('Invalid event identifier ' + eventIdentifier);
    }
};

export function getActionButton(eventIdentifier:string):ActionButtonInterface{
    let parts = eventIdentifier.split("_");
    let label:string = "Download";
    let iconName:string = "material-symbols-light:download";
    let isUrl = false;
    let tooltip = '';

    if(eventIdentifier.startsWith("http") && eventIdentifier.indexOf("download?") > 0) {
        //TODO: Urls only for downloads so far. Change in case of other requirements.
        isUrl = true;
        tooltip = 'Download Content';
    }else{
        switch (parts[0]) {
            case REPO_EVENTS.VIEW_RESOURCE:
                label = "View";
                iconName = "material-symbols-light:edit-square-outline";
                tooltip = 'View Resource';
                break;
            case REPO_EVENTS.EDIT_RESOURCE:
                label = "Edit";
                iconName = "material-symbols-light:edit-square-outline";
                tooltip = 'Edit Resource';
                break;
            case REPO_EVENTS.DOWNLOAD_RESOURCE:
                label = "Download";
                iconName = "material-symbols-light:download";
                tooltip = 'Download Resource';
                break;
            case REPO_EVENTS.EDIT_CONTENT:
                label = "Edit";
                iconName = "material-symbols-light:edit-square-outline";
                tooltip = 'Edit Content Metadata';
                break;
            case REPO_EVENTS.DELETE_CONTENT:
                label = "Remove";
                iconName = "material-symbols-light:delete-outline";
                tooltip = 'Delete Content';
                break;
            default:
                throw new Error('Invalid event identifier ' + eventIdentifier);
        }
    }

    if(isUrl) {
        return {label: label, iconName:iconName, url: eventIdentifier, tooltip: tooltip} as ActionButtonInterface
    }else{
        return {label: label, iconName:iconName, eventIdentifier: eventIdentifier,  tooltip: tooltip}  as ActionButtonInterface
    }
}

export const viewEventIdentifier = (resourceId:string) :string => {
    return `${REPO_EVENTS.VIEW_RESOURCE}_${resourceId}`;
}

export const editEventIdentifier = (resourceId:string) :string => {
    return `${REPO_EVENTS.EDIT_RESOURCE}_${resourceId}`;
}
export const downloadEventIdentifier = (resourceId:string) :string => {
    return `${REPO_EVENTS.DOWNLOAD_RESOURCE}_${resourceId}`;
}

export const editContentEventIdentifier = (resourceId:string, contentPath: string) :string => {
    return `${REPO_EVENTS.EDIT_CONTENT}_${resourceId}_${contentPath}`;
}

export const downloadContentEventIdentifier = (resourceId:string, contentPath: string) :string => {
    return `http://localhost:3000/api/download?resourceId=${resourceId}&filename=${contentPath}`
    //`${REPO_EVENTS.DOWNLOAD_CONTENT}_${resourceId}_${contentPath}`;
}

export const deleteContentEventIdentifier = (path: string) :string => {
    return `${REPO_EVENTS.DELETE_CONTENT}_${path}`;
}

export const makeThumbEventIdentifier = (resourceId: string, contentPath:string) :string => {
    return `${REPO_EVENTS.MAKE_THUMB}_${contentPath}`;
}

export const unmakeThumbEventIdentifier = (resourceId: string, contentPath:string) :string => {
    return `${REPO_EVENTS.UNMAKE_THUMB}_${contentPath}`;
}

export const addTagEventIdentifier = (resourceId: string, contentPath:string) :string => {
    return `${REPO_EVENTS.ADD_TAG}_${contentPath}`;
}

