import {Mapping} from "@/lib/mapping/definitions";
import {TextPropType} from "@kit-data-manager/data-view-web-component";
import {DataResource, Tag} from "@/lib/definitions";

export const propertiesForMapping = (mapping: Mapping) => {

    return {
        "dataTitle": titleForMapping(mapping),
        "imageUrl": thumbForMapping(mapping),
        "bodyText": descriptionForMapping(mapping),
        "textRight": textRightForMapping(mapping),
        "tags": tagsForMapping(mapping),
    }

}

const titleForMapping = (mapping: Mapping) => {
    return {"value": mapping.title} as TextPropType;
 }

const subtitleForMapping = (mapping: Mapping) => {
    return {"value": `Plugin: ${mapping.mappingType}`} as TextPropType;
}

const descriptionForMapping = (mapping: Mapping) => {
    return {"value": mapping.description} as TextPropType;
}

const thumbForMapping = (mapping: Mapping) => {
    return "/mapping.png";
}

export const tagsForMapping = (mapping: Mapping) => {
    let tags: Array<Tag> = new Array<Tag>;

    if(mapping.plugin){
        mapping.plugin.inputTypes.map(input => {
            tags.push({color: "#90EE90", text: input, iconName: "material-symbols:input-sharp", tooltip:"Input"} as Tag);
        });
        mapping.plugin.inputTypes.map(input => {
            tags.push({color: "#FFCCCB", text: input, iconName: "material-symbols:output-sharp", tooltip:"Output"} as Tag);
        });
    }

    return tags;
}

export const textRightForMapping = (mapping: Mapping) => {
        return {'label': "Plugin", 'value': mapping.plugin?.id} as TextPropType;
}