import {DataResource} from "@/app/lib/definitions";

export const getTitle = (resource: DataResource) => {

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

export const getSubtitle = (resource: DataResource) => {
    let subTitleValue = undefined;
    if (resource.titles) {
        resource.titles.map((title, i) => {
            if (title.titleType === "SUBTITLE") {
                subTitleValue = title.value;
            }
        });
    }

    if (!subTitleValue) {
        subTitleValue = getCreatorsAsSubtitle(resource);
    }

    return JSON.stringify(subTitleValue);
}

const getCreatorsAsSubtitle = (resource: DataResource) => {
    let subTitleValue = undefined;
    if(resource.creators) {
        resource.creators.map((creator, i) => {
            if (creator.givenName != "SELF" && (creator.givenName || creator.familyName)) {
                if(creator.familyName && creator.givenName){
                    if(!subTitleValue) subTitleValue = "";
                    subTitleValue += '<a href=\' https://orcid.org/orcid-search/search?firstName=' +
                        creator.givenName +
                        '&lastName=' +
                        creator.familyName + '\' target=\'_blank\'">' +
                        creator.familyName + "," + creator.givenName +
                        '</a>'
                }else{
                    subTitleValue = (creator.familyName) ? creator.familyName : creator.givenName;
                }
            }
            if (i < resource.creators.length - 1) {
                subTitleValue += ", ";
            }
        });
    }

    if(!subTitleValue){
        subTitleValue = "Anonymous User";
    }
    return subTitleValue;
}

export const getDescription = (resource: DataResource) => {
    let descriptionValue = "No description available.";
    if (resource.descriptions) {
        resource.descriptions.map((description, i) => {
            if (description.type === "ABSTRACT") {
                descriptionValue = description.description;
            }
        });
    }
    return JSON.stringify(descriptionValue);
}

export const getTags = (resource: DataResource) => {
    //state
    let tags = [];
    if (resource.state === "VOLATILE") {
        tags.push({"color": "#90EE90", "text": "Volatile", "iconName": "f7:pin-slash"});
    } else if (resource.state === "FIXED") {
        tags.push({"color": "yellow", "text": "Fixed", "iconName": "f7:pin"});
    } else if (resource.state === "REVOKED") {
        tags.push({"color": "#FFD580", "text": "Revoked", "iconName": "bytesize:trash"});
    } else if (resource.state === "GONE") {
        tags.push({"color": "#FFCCCB", "text": "Gone", "iconName": "bytesize:trash"});
    }

    //access
    let open = false;
    resource.acls.map((acl, i) => {
        if (acl.sid === "anonymousUser") {
            tags.push({"color": "#90EE90", "text": "Open", "iconName": "zondicons:lock-open"});
            open = true;
        }
    });

    if (!open) {
        tags.push({"color": "#FFCCCB", "text": "Protected", "iconName": "zondicons:lock-closed"});
    }

    //rights
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

    if (resource.embargoDate) {
        tags.push({"color": "#FFCCCB", "text": "Embargo", "iconName": "tdesign:secured"});
    }

    return JSON.stringify(tags);
}

export const getThumb = (resource: DataResource) => {
    let thumb = "https://via.placeholder.com/192?text=placeholder";
    if (resource.children && resource.children.length > 0) {
        resource.children.map((content, i) => {
            content.tags.map((tag, i) =>{
                if(tag.toLocaleLowerCase() === "thumb"){
                    thumb = content.contentUri;
                }
            });
        });
    }

    return thumb;
}

export const getChildren = (resource: DataResource) => {
    let children = undefined;
    if (resource.children && resource.children.length > 0) {
        children = []
        resource.children.map((content, i) => {
            let child = {};
            child["dataTitle"] = content.relativePath;
            child["subTitle"] = content.hash;
            child["text-right"] = JSON.stringify({
                "label": content.mediaType,
                "value": content.size + " bytes"
            });
            child["actionButtons"] = JSON.stringify([{
                "label": "Edit",
                "urlTarget": "_self",
                "iconName": "material-symbols-light:edit-square-outline",
                "url": `http://localhost:8081/api/v1/dataresources/${resource.id}/data/${content.relativePath}/edit`
            }, {
                "label": "Download",
                "iconName": "material-symbols-light:download",
                "urlTarget": "_blank",
                "url": `http://localhost:8081/api/v1/dataresources/${resource.id}/data/${content.relativePath}`
            }]);

            children.push(child);
        });
        return JSON.stringify(children);
    }

    return children;
}



