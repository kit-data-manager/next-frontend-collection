import {ContentInformation, DataResource, ResourceType, TypeGeneral} from "@/lib/definitions";
import {formatDateToLocal, humanFileSize} from "@/lib/format-utils";
import {ActionButtonInterface} from "@/app/base-repo/components/DataResourceCard/DataResourceCard.d";
import {DownloadContentAction} from "@/lib/base-repo/actions/downloadContentAction";
import {ToggleThumbAction} from "@/lib/base-repo/actions/toggleThumbAction";
import {ToggleTagAction} from "@/lib/base-repo/actions/toggleTagAction";
import {
    Components,
    Tag,
    TextPropType,
    ValueLabelObj,
    ValueLabelObjWithUrl
} from "@kit-data-manager/data-view-web-component";
import DataCard = Components.DataCard;

export const propertiesForDataResource = (resource: DataResource) => {
    let children: Array<DataCard> = childrenForDataResource(resource);

    if (children.length == 0) {
        return {
            "dataTitle": titleForDataResource(resource),
            "subTitle": subtitleForDataResource(resource),
            "imageUrl": thumbForDataResource(resource),
            "bodyText": descriptionForDataResource(resource),
            "textRight": rightTextForDataResource(resource),
            "metadata": metadataForDataResource(resource),
            "tags": tagsForDataResource(resource),
        }
    }
    return {
        "dataTitle": titleForDataResource(resource),
        "subTitle": subtitleForDataResource(resource),
        "imageUrl": thumbForDataResource(resource),
        "bodyText": descriptionForDataResource(resource),
        "textRight": rightTextForDataResource(resource),
        "metadata": metadataForDataResource(resource),
        "childrenData": childrenForDataResource(resource),
        "childrenLabel": "File(s)",
        "tags": tagsForDataResource(resource),
    }
}

export const propertiesForContentInformation = (resourceId: string,
                                                content: ContentInformation,
                                                actionButtons?: Array<ActionButtonInterface>,
                                                disableChangeThumb?: boolean): DataCard => {
    let tags: Array<Tag> = new Array<Tag>;
    const basePath: string = (process.env.NEXT_PUBLIC_BASE_PATH ? process.env.NEXT_PUBLIC_BASE_PATH : "");

    let image = `${basePath}/data.png`;

    if (['jpg', 'jpeg', 'gif', 'png'].some(ext => content.relativePath.toLowerCase().endsWith(ext))) {
        let isThumb = content.tags && content.tags.includes("thumb");
        let thumbTag: Tag;
        if (disableChangeThumb) {
            if (isThumb) {
                thumbTag = {
                    color: "var(--success)",
                    text: "Thumb",
                    tooltip: "Thumbnail for Resource."
                }
                tags.push(thumbTag);
            }
        } else {
            thumbTag = {
                color: isThumb ? "var(--success)" : "var(--error)",
                text: "Thumb",
                eventIdentifier: new ToggleThumbAction(resourceId, content.relativePath).getActionId(),
                tooltip: isThumb ? "Click to NOT use this image as resource thumbnail." : "Click to use this image as resource thumbnail."
            }
            tags.push(thumbTag);
        }
        image = `${basePath}/api/download?resourceId=${resourceId}&filename=${content.relativePath}&type=thumb`
    }

    if (content.tags) {
        content.tags.forEach(tag => {
            if (tag.toLowerCase() != "thumb") {
                let tagElement: Tag = {
                    color: "var(--info)",
                    eventIdentifier: new ToggleTagAction(resourceId, content.relativePath, tag).getActionIdentifier(),
                    text: tag,
                    tooltip: "Click to remove tag '" + tag + "'"
                }
                tags.push(tagElement);
                /*let removeTagElement:Tag = {
                    color: "var(--destructive)",
                    text:"x",
                    eventIdentifier: new ToggleTagAction(resourceId, content.relativePath, tag).getActionIdentifier(),
                    tooltip: "Click to remove tag '" + tag + "'"
                }
                tags.push(removeTagElement);*/
            }
        });
    }

    if (!disableChangeThumb) {
        tags.push({
            color: "var(--info)",
            iconName: "heroicons:plus-small-20-solid",
            eventIdentifier: new ToggleTagAction(resourceId, content.relativePath).getActionIdentifier(),
            tooltip: "Click to add a new tag."

        } as Tag);
    }

    if (actionButtons) {
        return {
            dataTitle: {value: content.relativePath} as TextPropType,
            subTitle: {value: content.hash} as TextPropType,
            imageUrl: image,
            textRight: {label: content.mediaType, value: humanFileSize(content.size)} as TextPropType,
            tags: tags,
            actionButtons: actionButtons
        } as DataCard;
    } else {
        return {
            dataTitle: {value: content.relativePath} as TextPropType,
            subTitle: {value: content.hash} as TextPropType,
            imageUrl: image,
            textRight: {label: content.mediaType, value: humanFileSize(content.size)} as TextPropType,
            tags: tags
        } as DataCard;
    }
}

function generateSubtitleFromCreator(resource: DataResource) {
    let subTitleValue: TextPropType = "";
    const basePath: string = (process.env.NEXT_PUBLIC_BASE_PATH ? process.env.NEXT_PUBLIC_BASE_PATH : "");
    let haveCreator: boolean = false;

    if (resource.creators) {
        resource.creators.map((creator, i) => {
            if (creator.givenName != "SELF" && (creator.givenName || creator.familyName)) {
                if (creator.familyName && creator.givenName) {
                    subTitleValue = `<img src="${basePath}/ORCID_iD_32x32.svg.png" alt="ORCiD Logo" part="orcid-logo" /><a href="https://orcid.org/orcid-search/search?firstName=${creator.givenName}&lastName=${creator.familyName}" target="_blank" part="orcid-link">${creator.familyName}, ${creator.givenName}</a>`;
                } else {
                    subTitleValue = (creator.familyName) ? creator.familyName : creator.givenName;
                }
                haveCreator = true;
            }
            if (i < resource.creators.length - 1) {
                subTitleValue += ", ";
            }
        });
    }

    if (!haveCreator) {
        subTitleValue = "Anonymous User";
    }
    //return as string, not as object, to allow HTML detection in component
    return subTitleValue as TextPropType;
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
        titleValue = {value: "INVALID RESOURCE (no title)"} as TextPropType;
    }

    return titleValue;
}

const subtitleForDataResource = (resource: DataResource) => {
    let subTitleValue: TextPropType = generateSubtitleFromCreator(resource);
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
    //type tag
    let tags: Array<Tag> = new Array<Tag>;
    if (resource.resourceType) {
        const typeGeneral: TypeGeneral = resource.resourceType.typeGeneral;
        const filterUrl = `/base-repo/resources/?typeGeneral=${typeGeneral}`;
        tags.push({
            color: "#90EE90",
            text: typeGeneral,
            iconName: "fluent-mdl2:shapes",
            tooltip: "The resource type.",
            url: filterUrl
        } as Tag);
    }

    //state tags
    const filterUrl = `/base-repo/resources/?state=${resource.state}`;
    if (resource.state === "VOLATILE") {
        tags.push({
            color: "#90EE90",
            text: "Volatile",
            iconName: "f7:pin-slash",
            tooltip: "The resource can be modified.",
            url: filterUrl
        } as Tag);
    } else if (resource.state === "FIXED") {
        tags.push({
            color: "yellow",
            text: "Fixed",
            iconName: "f7:pin",
            tooltip: "The resource cannot be modified.",
            url: filterUrl
        } as Tag);
    } else if (resource.state === "REVOKED") {
        tags.push({
            color: "#FFD580",
            text: "Revoked",
            iconName: "bytesize:trash",
            tooltip: "The resource is no longer publicly available.",
            url: filterUrl
        } as Tag);
    } else if (resource.state === "GONE") {
        tags.push({
            color: "#FFCCCB",
            text: "Gone",
            iconName: "bytesize:trash",
            tooltip: "The resource is no longer available.",
            url: filterUrl
        } as Tag);
    }

    //access tags
    let open = false;
    if (resource.acls) {
        resource.acls.map((acl, i) => {
            if (acl.sid === "anonymousUser") {
                open = true;
            }
        });
    } else {
        //no acls, should be hidden due to public access
        open = true;
    }

    if (open) {
        tags.push({
            color: "#90EE90",
            text: "Open",
            iconName: "zondicons:lock-open",
            tooltip: "The resource is publicly accessible."
        } as Tag);
    } else {
        tags.push({
            color: "#FFCCCB",
            text: "Protected",
            iconName: "zondicons:lock-closed",
            tooltip: "The resource has access restrictions."
        } as Tag);
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
        tags.push({
            color: "#FFCCCB",
            text: "Unlicensed",
            iconName: "mynaui:copyright-slash",
            tooltip: "The resource has no license assigned."
        } as Tag);
    }

    return tags;
}

export const thumbForDataResource = (resource: DataResource) => {
    return thumbFromContentArray(resource.children);
}

export const thumbFromContentArray = (content: ContentInformation[]) => {
    const basePath: string = (process.env.NEXT_PUBLIC_BASE_PATH ? process.env.NEXT_PUBLIC_BASE_PATH : "");

    let thumb = `${basePath}/data.png`;//"https://via.placeholder.com/192?text=placeholder";
    if (content && content.length > 0) {
        content.map((contentElement, i) => {
            contentElement.tags.map((tag, i) => {
                if (tag.toLocaleLowerCase() === "thumb") {
                    thumb = `${basePath}/api/download?resourceId=${contentElement.parentResource.id}&filename=${contentElement.relativePath}&type=thumb`
                }
            });
        });
    }

    return thumb;
}

const metadataForDataResource = (resource: DataResource) => {
    let elements: Array<ValueLabelObj | ValueLabelObjWithUrl> = new Array<ValueLabelObj | ValueLabelObjWithUrl>;

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
    let children: Array<DataCard> = new Array<DataCard>;
    if (resource.children && resource.children.length > 0) {
        resource.children.map((content, i) => {
            let actionButtons = [
                //only add download button
                new DownloadContentAction(resource.id, content.relativePath).getDataCardAction()
            ];

            children.push(propertiesForContentInformation(resource.id, content, actionButtons, true) as DataCard);
        });
        return children;
    }

    return children;
}

