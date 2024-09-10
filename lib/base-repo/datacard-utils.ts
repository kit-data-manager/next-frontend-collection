import {ContentInformation, DataResource} from "@/lib/definitions";
import {formatDateToLocal, humanFileSize} from "@/lib/format-utils";
import {
    addTagEventIdentifier,
    getActionButton,
    makeThumbEventIdentifier,
    unmakeThumbEventIdentifier
} from "@/lib/event-utils";
import {ActionButtonInterface} from "@/app/base-repo/components/DataResourceCard/DataResourceCard.d";
import {Tag, TextPropType, ValueLabelObj, ValueLabelObjWithUrl} from "../../../data-view-web-component";
import {DataCard} from "../../../data-view-web-component/dist/components/data-card";

export const propertiesForDataResource = (resource: DataResource) => {
    return {
        "dataTitle": titleForDataResource(resource),
        "subTitle": subtitleForDataResource(resource),
        "imageUrl": thumbForDataResource(resource),
        "bodyText": descriptionForDataResource(resource),
        "textRight": rightTextForDataResource(resource),
        "metadata": metadataForDataResource(resource),
        "childrenData": childrenForDataResource(resource),
        "tags": tagsForDataResource(resource),
    }
}

export const propertiesForContentInformation = (resourceId: string,
                                                content: ContentInformation,
                                                actionButtons?: Array<ActionButtonInterface>,
                                                disableChangeThumb?: boolean) => {
    let tags:Array<Tag> = new Array<Tag>;

    if(['jpg','jpeg','gif','png'].some(ext => content.relativePath.toLowerCase().endsWith(ext))) {
        let isThumb = content.tags && content.tags.includes("thumb");
        let thumbTag:Tag;
        if(disableChangeThumb){
            thumbTag = {
                color: isThumb ? "var(--success)" : "var(--error)",
                text: "Thumb",
            }
        }else{
            thumbTag = {
                color: isThumb ? "var(--success)" : "var(--error)",
                text: "Thumb",
                eventIdentifier: isThumb ? unmakeThumbEventIdentifier(resourceId, content.relativePath) : makeThumbEventIdentifier(resourceId, content.relativePath)
            }
        }

        tags.push(thumbTag);
    }

    if(!disableChangeThumb) {
        tags.push({
            "color": "var(--info)",
            "iconName": "heroicons:plus-small-20-solid",
            "eventIdentifier": addTagEventIdentifier(resourceId, content.relativePath)
        } as Tag);
    }

    if (actionButtons) {
        return {
            "dataTitle":{value: content.relativePath} as TextPropType,
            "subTitle": {value: content.hash} as TextPropType,
            "textRight": {label: content.mediaType, value: humanFileSize(content.size)} as TextPropType,
            "tags": tags ,
            "actionButtons": actionButtons
        }
    } else {
        return {
            "dataTitle": {value: content.relativePath} as TextPropType,
            "subTitle": {value: content.hash} as TextPropType,
            "textRight": {label: content.mediaType, value: humanFileSize(content.size)} as TextPropType,
            "tags": tags
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
    return {"value": subTitleValue} as TextPropType;;
}

const titleForDataResource = (resource: DataResource) => {

    let titleValue = {"value": "Resource #" + resource.id} as TextPropType;
    if (resource.titles) {
        resource.titles.map((title, i) => {
            if (!title.titleType) {
                titleValue = {"value": title.value} as TextPropType;
            }
        });
    } else {
        titleValue = {"value": "INVALID RESOURCE (no title)"} as TextPropType;
    }

    return titleValue;
}

const subtitleForDataResource = (resource: DataResource) => {
    let subTitleValue:TextPropType = generateSubtitleFromCreator(resource);
    if (resource.titles) {
        resource.titles.map((title, i) => {
            if (title.titleType === "SUBTITLE") {
                subTitleValue = {"value": title.value} as TextPropType;
            }
        });
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
    let tags: Array<Tag> = new Array<Tag>;
    if (resource.state === "VOLATILE") {
        tags.push({color: "#90EE90", text: "Volatile", iconName: "f7:pin-slash"} as Tag);
    } else if (resource.state === "FIXED") {
        tags.push({color: "yellow", text: "Fixed", iconName: "f7:pin"}  as Tag);
    } else if (resource.state === "REVOKED") {
        tags.push({color: "#FFD580", text: "Revoked", iconName: "bytesize:trash"}  as Tag);
    } else if (resource.state === "GONE") {
        tags.push({color: "#FFCCCB", text: "Gone", iconName: "bytesize:trash"}  as Tag);
    }

    //access tags
    let open = false;
    if(resource.acls) {
        resource.acls.map((acl, i) => {
            if (acl.sid === "anonymousUser") {
                tags.push({"color": "#90EE90", "text": "Open", "iconName": "zondicons:lock-open"}  as Tag);
                open = true;
            }
        });
    }else{
        tags.push({"color": "#90EE90", "text": "Open", "iconName": "zondicons:lock-open"} as Tag);
        open = true;
    }

    if (!open) {
        tags.push({"color": "#FFCCCB", "text": "Protected", "iconName": "zondicons:lock-closed"} as Tag);
    }

    //rights tag
    if (resource.rights && resource.rights.length > 0) {
        tags.push({
            "color": "#90EE90",
            "text": "Licensed",
            "iconName": "mynaui:copyright",
            "url": resource.rights[0].schemeUri
        } as Tag);
    } else {
        tags.push({"color": "#FFCCCB", "text": "Unlicensed", "iconName": "mynaui:copyright-slash"} as Tag);
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
    let elements:Array<ValueLabelObj | ValueLabelObjWithUrl> = new Array<ValueLabelObj | ValueLabelObjWithUrl>;

    elements.push({
        label: "ResourceType",
        value: resource.resourceType.value + "/" + resource.resourceType.typeGeneral
    } as ValueLabelObj);

    if (resource.language) {
        elements.push({
            label: "Language",
            value: resource.language
         } as ValueLabelObj);
    }

    if (resource.dates) {
        resource.dates.map((date, i) => {
            if (date.type === "CREATED") {
                elements.push({
                    label: "Creation Date",
                    value: formatDateToLocal(date.value)
                } as ValueLabelObj);
            }
        });
    }

    elements.push({
        label: "Last Update",
        value: formatDateToLocal(resource.lastUpdate)
    } as ValueLabelObj);

    if (resource.embargoDate) {
        elements.push({
            label: "Embargo",
            value: resource.embargoDate
        } as ValueLabelObj);
    } else {
        elements.push({
            label: "Embargo",
            value: "None"
        } as ValueLabelObj);
    }

    if (resource.subjects) {
        elements.push({
            label: "Subjects"
        } as ValueLabelObj);
        resource.subjects.map((subject, i) => {
            if (subject.valueUri) {
                elements.push({
                    value: `${subject.value}`,
                    url: subject.valueUri
                } as ValueLabelObjWithUrl);
            } else {
                elements.push({
                    value: `${subject.value}`,
                } as ValueLabelObj);
            }
        });
    }

    if (resource.relatedIdentifiers) {
        elements.push({
            label: "Related Identifiers"
        } as ValueLabelObj);
        resource.relatedIdentifiers.map((identifier, i) => {
            if (identifier.identifierType === "URL") {
                elements.push({
                    value: `${identifier.relationType}`,
                    url: identifier.value
                } as ValueLabelObjWithUrl);
            }
        });
    }


    return elements;
}

const childrenForDataResource = (resource: DataResource) => {
    let children:Array<DataCard> = new Array<DataCard>;
    if (resource.children && resource.children.length > 0) {
        resource.children.map((content, i) => {
            let actionButtons = [
                //only add download button
                getActionButton(`http://localhost:3000/api/download?resourceId=${resource.id}&filename=${content.relativePath}`)
            ];

            children.push(propertiesForContentInformation(resource.id, content, actionButtons, true) as DataCard);
        });
        return children;
    }

    return children;
}

