
const REPO_BASE_PATH = "/base-repo/resources/";
const VIEW_PATH = "view";
const EDIT_PATH = "edit";
const DOWNLOAD_RESOURCE_PATH = "download";
const EDIT_CONTENT_PATH = "edit_content?path=";
const DOWNLOAD_CONTENT_PATH = "download_content?path=";
const enum REPO_EVENTS {
    "VIEW_RESOURCE" = "viewResource",
    "EDIT_RESOURCE" = "editResource",
    "DOWNLOAD_RESOURCE" = "downloadResource",
    "EDIT_CONTENT" = "editContent",
    "DOWNLOAD_CONTENT" = "downloadContent"}



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
        default:
            throw new Error('Invalid event identifier ' + eventIdentifier);
    }
};

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
    return `${REPO_EVENTS.DOWNLOAD_CONTENT}_${resourceId}_${contentPath}`;
}