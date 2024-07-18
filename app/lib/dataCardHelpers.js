export function createLabeledField( value, label=undefined, defaultValue="Unspecified Title"){
    if(!value){
        value = defaultValue
    }
    return JSON.stringify({"label": label, "value": value});
}

export function createTag(value, color, icon = undefined, url=undefined){
    return {
        "text": value,
        "color": color,
        "iconName": icon,
        "url": url
    };
}

export function createActionButton(url, label, icon){
    return {
        "iconName": icon,
        "label": label,
        "url": url
    };
}
