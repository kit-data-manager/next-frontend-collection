import {DataResource} from "@/lib/definitions";
import {TextPropType, ValueLabelObj, ValueLabelObjWithUrl} from "@kit-data-manager/data-view-web-component";
import {formatDateToLocal} from "@/lib/general/format-utils";

export const titleForDataResource = (resource: DataResource) => {
    let titleValue = {"value": "Resource #" + resource.id} as TextPropType;
    let haveTitle:boolean = false;
    if (resource.titles) {
        resource.titles.map((title, i) => {
            if (!haveTitle || !title.titleType) {
                titleValue = {"value": title.value} as TextPropType;
                haveTitle = true;
            }
        });
    } else {
        titleValue = {value: "INVALID RESOURCE (no title)"} as TextPropType;
    }

    return titleValue;
}

export const subtitleForDataResource = (resource: DataResource) => {
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

export const descriptionForDataResource = (resource: DataResource) => {
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

export const rightTextForDataResource = (resource: DataResource) => {
    return JSON.stringify({'label': resource.publisher, 'value': resource.publicationYear});
}
export const metadataForDataResource = (resource: DataResource) => {
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
