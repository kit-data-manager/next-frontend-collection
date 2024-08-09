import {TextPropType, Tag, ActionButtonInterface} from "../../data-view-web-component";

export function createLabeledField( value, label=undefined, defaultValue="Unspecified Title") :TextPropType{
    if(label){
         return {label: label, value: value ? value : defaultValue} as TextPropType;
    }else{
        return { value: value} as TextPropType;
    }
}

export function createTag(value, color, icon = undefined, url=undefined):Tag{
    return {
        "text": value,
        "color": color,
        "iconName": icon,
        "url": url
    } as Tag;
}

export function createActionButton(url, label, icon): ActionButtonInterface{
    return {
        "iconName": icon,
        "label": label,
        "url": url
    } as ActionButtonInterface;
}
