import {ContentInformation, DataResource, Tag} from "@/app/lib/definitions";
import {formatDateToLocal, humanFileSize} from "@/app/lib/format-utils";
import {getActionButton} from "@/app/lib/event-utils";

export const propertiesForDataResource = (resource: DataResource) => {
    return {
        "data-title": titleForDataResource(resource),
        "sub-title": subtitleForDataResource(resource),
        "image-url": thumbForDataResource(resource),
        "body-text": descriptionForDataResource(resource),
        "textRight": rightTextForDataResource(resource),
        "metadata": metadataForDataResource(resource),
        "children-data": childrenForDataResource(resource),
        "tags": tagsForDataResource(resource),
    }
}

export const propertiesForContentInformation = (resourceId: string, content: ContentInformation, actionButtons?: object[]) => {
    let tags = [];
    if (content.tags && content.tags.includes("thumb")) {
        tags.push({
            "color": "#90EE90",
            "text": "Thumb",
        });
    }

    if (actionButtons) {
        return {
            "data-title": JSON.stringify({value: content.relativePath}),
            "sub-title": JSON.stringify({value: content.hash}),
            "textRight": JSON.stringify({label: content.mediaType, value: humanFileSize(content.size)}),
            "tags": JSON.stringify(tags),
            "actionButtons": actionButtons
        }
    } else {
        return {
            "data-title": JSON.stringify({value: content.relativePath}),
            "sub-title": JSON.stringify({value: content.hash}),
            "textRight": JSON.stringify({label: content.mediaType, value: humanFileSize(content.size)}),
            "tags": JSON.stringify(tags)
        }
    }
}

function generateSubtitleFromCreator(resource: DataResource) {
    let subTitleValue: string = '';
    if (resource.creators) {
        resource.creators.map((creator, i) => {
            if (creator.givenName != "SELF" && (creator.givenName || creator.familyName)) {
                if (creator.familyName && creator.givenName) {
                    if (!subTitleValue) subTitleValue = "";
                    subTitleValue += `<img src="/ORCID_iD_32x32.svg.png" alt="ORCiD Logo" part="myclass" /><a href="https://orcid.org/orcid-search/search?firstName=${creator.givenName}&lastName=${creator.familyName}" target="_blank">${creator.familyName}, ${creator.givenName}</a>`
                } else {
                    subTitleValue = (creator.familyName) ? creator.familyName : creator.givenName;
                }
            }
            if (i < resource.creators.length - 1) {
                subTitleValue += ", ";
            }
        });
    }

    if (subTitleValue.length == 0) {
        subTitleValue = "Anonymous User";
    }
    return subTitleValue;
}

const titleForDataResource = (resource: DataResource) => {

    let titleValue = {"value": "Resource #" + resource.id};
    if (resource.titles) {
        resource.titles.map((title, i) => {
            if (!title.titleType) {
                titleValue = {"value": title.value};
            }
        });
    } else {
        titleValue = {"value": "INVALID RESOURCE (no title)"};
    }

    return JSON.stringify(titleValue);
}

const subtitleForDataResource = (resource: DataResource) => {
    let subTitleValue = undefined;
    if (resource.titles) {
        resource.titles.map((title, i) => {
            if (title.titleType === "SUBTITLE") {
                subTitleValue = JSON.stringify({"value": title.value});
            }
        });
    }

    if (!subTitleValue) {
        subTitleValue = generateSubtitleFromCreator(resource);
    }

    return subTitleValue;
}

const descriptionForDataResource = (resource: DataResource) => {
    let descriptionValue = "No description available.";
    if (resource.descriptions) {
        resource.descriptions.map((description, i) => {
            if (description.type === "ABSTRACT") {
                descriptionValue = description.description;
            }
        });
    }
    return JSON.stringify({"value": descriptionValue});
}

const rightTextForDataResource = (resource: DataResource) => {
    return JSON.stringify({'label': resource.publisher, 'value': resource.publicationYear});
}

const tagsForDataResource = (resource: DataResource) => {
    //state tags
    let tags: Tag[] = [];
    if (resource.state === "VOLATILE") {
        tags.push({color: "#90EE90", text: "Volatile", iconName: "f7:pin-slash"});
    } else if (resource.state === "FIXED") {
        tags.push({color: "yellow", text: "Fixed", iconName: "f7:pin"});
    } else if (resource.state === "REVOKED") {
        tags.push({color: "#FFD580", text: "Revoked", iconName: "bytesize:trash"});
    } else if (resource.state === "GONE") {
        tags.push({color: "#FFCCCB", text: "Gone", iconName: "bytesize:trash"});
    }

    //access tags
    let open = false;
    if(resource.acls) {
        resource.acls.map((acl, i) => {
            if (acl.sid === "anonymousUser") {
                tags.push({"color": "#90EE90", "text": "Open", "iconName": "zondicons:lock-open"});
                open = true;
            }
        });
    }else{
        tags.push({"color": "#90EE90", "text": "Open", "iconName": "zondicons:lock-open"});
        open = true;
    }

    if (!open) {
        tags.push({"color": "#FFCCCB", "text": "Protected", "iconName": "zondicons:lock-closed"});
    }

    //rights tag
    if (resource.rights && resource.rights.length > 0) {
        tags.push({
            "color": "#90EE90",
            "text": "Licensed",
            "iconName": "mynaui:copyright",
            "url": resource.rights[0].schemeUri
        });
    } else {
        tags.push({"color": "#FFCCCB", "text": "Unlicensed", "iconName": "mynaui:copyright-slash"});
    }

    return tags;
}

const thumbForDataResource = (resource: DataResource) => {
    let thumb = "/data.png";//"https://via.placeholder.com/192?text=placeholder";
    if (resource.children && resource.children.length > 0) {
        resource.children.map((content, i) => {
            content.tags.map((tag, i) => {
                if (tag.toLocaleLowerCase() === "thumb") {
                    thumb = content.contentUri;
                }
            });
        });
    }

    return thumb;
}

const metadataForDataResource = (resource: DataResource) => {
    let elements = [];

    elements.push({
        label: "ResourceType",
        value: resource.resourceType.value + "/" + resource.resourceType.typeGeneral
    });

    if (resource.language) {
        elements.push({
            label: "Language",
            value: resource.language
        });
    }

    if (resource.dates) {
        resource.dates.map((date, i) => {
            if (date.type === "CREATED") {
                elements.push({
                    label: "Creation Date",
                    value: formatDateToLocal(date.value)
                });
            }
        });
    }

    elements.push({
        label: "Last Update",
        value: formatDateToLocal(resource.lastUpdate)
    });

    if (resource.embargoDate) {
        elements.push({
            label: "Embargo",
            value: resource.embargoDate
        });
    } else {
        elements.push({
            label: "Embargo",
            value: "None"
        });
    }

    if (resource.subjects) {
        elements.push({
            label: "Subjects"
        });
        resource.subjects.map((subject, i) => {
            if (subject.valueUri) {
                elements.push({
                    value: `${subject.value}`,
                    url: subject.valueUri
                });
            } else {
                elements.push({
                    value: `${subject.value}`,
                });
            }
        });
    }

    if (resource.relatedIdentifiers) {
        elements.push({
            label: "Related Identifiers"
        });
        resource.relatedIdentifiers.map((identifier, i) => {
            if (identifier.identifierType === "URL") {
                elements.push({
                    value: `${identifier.relationType}`,
                    url: identifier.value
                });
            }
        });
    }


    return elements;
}

const childrenForDataResource = (resource: DataResource) => {
    let children = undefined;
    if (resource.children && resource.children.length > 0) {
        children = []
        resource.children.map((content, i) => {
            let actionButtons = [
                getActionButton(`http://localhost:3000/api/download?resourceId=${resource.id}&filename=${content.relativePath}`)
            ];

            children.push(propertiesForContentInformation(resource.id, content, actionButtons));
        });
        return JSON.stringify(children);
    }

    return children;
}

