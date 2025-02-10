import {Tag, TextPropType} from "@kit-data-manager/data-view-web-component";

export function createLabeledField( value:string, label=undefined, defaultValue="Unspecified Title") :TextPropType{
    if(label){
         return {label: label, value: value ? value : defaultValue} as TextPropType;
    }else{
        return { value: value} as TextPropType;
    }
}

export function createTag(value:string, color:string, icon = undefined, url=undefined):Tag{
    return {
        "text": value,
        "color": color,
        "iconName": icon,
        "url": url
    } as Tag;
}
