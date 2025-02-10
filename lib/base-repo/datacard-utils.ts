import {ContentInformation, DataResource, ResourceType, TypeGeneral} from "@/lib/definitions";
import {humanFileSize} from "@/lib/general/format-utils";
import {ActionButtonInterface} from "@/app/base-repo/components/DataResourceCard/DataResourceCard.d";
import {DownloadContentAction} from "@/lib/actions/base-repo/downloadContentAction";
import {RemoveTagAction} from "@/lib/actions/base-repo/removeTagAction";
import {
    Components,
    Tag,
    TextPropType
} from "@kit-data-manager/data-view-web-component";
import {AddTagAction} from "@/lib/actions/base-repo/addTagAction";
import DataCard = Components.DataCard;
import {
    descriptionForDataResource, metadataForDataResource,
    rightTextForDataResource,
    subtitleForDataResource,
    titleForDataResource
} from "@/lib/general/datacard-utils";

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
        if (content.size < 160 * 1024) {
            let isThumb = content.tags && content.tags.includes("thumb");
            if (!isThumb) {
                let thumbTag: Tag = {
                    color: "var(--error)",
                    text: "Thumb",
                    eventIdentifier: new AddTagAction(resourceId, content.relativePath, content.etag ? content.etag : "NoEtag", "thumb").getActionId(),
                    tooltip: "Click to use this image as resource thumbnail."
                }
                tags.push(thumbTag);
            }
        }
        image = `${basePath}/api/base-repo/download?resourceId=${resourceId}&filename=${content.relativePath}&type=thumb`
    }

    if (content.tags) {
        content.tags.forEach((tag, index) => {
            if (tag.toLowerCase() != "thumb") {
                let tagElement: Tag = {
                    color: "var(--info)",
                    eventIdentifier: new RemoveTagAction(resourceId, content.relativePath, content.etag ? content.etag : "NoEtag", index).getActionIdentifier(),
                    text: tag,
                    tooltip: "Click to remove tag '" + tag + "'"
                }
                tags.push(tagElement);
            } else {
                //existing thumb tag
                let thumbTagElement: Tag;
                if (!disableChangeThumb) {
                    thumbTagElement = {
                        color: "var(--success)",
                        eventIdentifier: new RemoveTagAction(resourceId, content.relativePath, content.etag ? content.etag : "NoEtag", index).getActionIdentifier(),
                        text: "Thumb",
                        tooltip: "Click to NOT use this image as resource thumbnail."
                    }
                } else {
                    thumbTagElement = {
                        color: "var(--success)",
                        text: "Thumb",
                        tooltip: "Thumbnail for Resource."
                    }
                }
                tags.push(thumbTagElement);
            }
        });
    }

    if (!disableChangeThumb) {
        tags.push({
            color: "var(--info)",
            iconName: "heroicons:plus-small-20-solid",
            eventIdentifier: new AddTagAction(resourceId, content.relativePath, content.etag ? content.etag : "NoEtag").getActionIdentifier(),
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

const tagsForDataResource = (resource: DataResource) => {
    //type tag
    const basePath: string = (process.env.NEXT_PUBLIC_BASE_PATH ? process.env.NEXT_PUBLIC_BASE_PATH : "");

    let tags: Array<Tag> = new Array<Tag>;
    if (resource.resourceType) {
        const typeGeneral: TypeGeneral = resource.resourceType.typeGeneral;
        const filterUrl = `${basePath}/base-repo/resources/?typeGeneral=${typeGeneral}`;
        tags.push({
            color: "#90EE90",
            text: typeGeneral,
            iconName: "fluent-mdl2:shapes",
            tooltip: "The resource type.",
            url: filterUrl
        } as Tag);
    }

    //state tags
    const filterUrl = `${basePath}/base-repo/resources/?state=${resource.state}`;
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
                    thumb = `${basePath}/api/base-repo/download?resourceId=${contentElement.parentResource.id}&filename=${contentElement.relativePath}&type=thumb`
                }
            });
        });
    }
    return thumb;
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