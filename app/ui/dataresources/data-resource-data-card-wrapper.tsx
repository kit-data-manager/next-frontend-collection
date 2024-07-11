'use client'

import {DataCard} from "data-card-react";
import {propertiesForContentInformation, propertiesForDataResource} from "@/app/lib/base-repo/datacard-utils";
import {useDebouncedCallback} from "use-debounce";
import {useRouter} from "next/navigation";

import {
    downloadEventIdentifier,
    editEventIdentifier,
    eventIdentifierToPath, getActionButton,
    viewEventIdentifier
} from "@/app/lib/event-utils";

export default function DataResourceDataCardWrapper(props) {
    const {replace} = useRouter();
    const key = props.key;
    const data = props.data;
    const variant = props.variant ? props.variant : "default";
    const childVariant = props.children-variant ? props.children-variant : "default";
    const actionEvents = props.actionEvents ? props.actionEvents : [];

    const handleAction = useDebouncedCallback((event) => {
        const eventIdentifier: string = event.detail.eventIdentifier;
        replace(eventIdentifierToPath(eventIdentifier));
    });


    let buttons = [];

    actionEvents.map((eventIdentifier) => {
        buttons.push(getActionButton(eventIdentifier));
    })

    let miscProperties = undefined;
    if(data.hasOwnProperty("titles")){
        miscProperties = propertiesForDataResource(data);
    }else{
        miscProperties = propertiesForContentInformation(data.parentResource.id, data);
    }
       
    return (
        <div>
            <DataCard key={key}
                      variant={variant}
                      children-variant={childVariant}
                      actionButtons={buttons}
                      onActionClick={ev => handleAction(ev)}
                      {...miscProperties}>
            </DataCard>
        </div>
    )
}

