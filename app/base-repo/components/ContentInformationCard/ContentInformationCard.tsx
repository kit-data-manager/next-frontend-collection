'use client'

import {DataCard} from "data-card-react";
import {propertiesForContentInformation, propertiesForDataResource} from "@/lib/base-repo/datacard-utils";
import {useDebouncedCallback} from "use-debounce";
import {useRouter} from "next/navigation";

import {
    eventIdentifierToPath,
    getActionButton
} from "@/lib/event-utils";
import {ActionButtonInterface} from "@/app/base-repo/components/DataResourceCard/DataResourceCard.d";
import {ContentInformation, DataResource} from "@/lib/definitions";
import {ContentInformationCardProps} from "@/app/base-repo/components/ContentInformationCard/ContentInformationCard.d";


export default function ContentInformationCard(props:ContentInformationCardProps) {

    const handleAction = useDebouncedCallback((event) => {
        const eventIdentifier: string = event.detail.eventIdentifier;
        replace(eventIdentifierToPath(eventIdentifier));
        ///tag events
    });


    const {replace} = useRouter();
    const data:ContentInformation = props.data;
    const variant:"default"|"detailed"|"minimal" | undefined = props.variant ? props.variant : "default";
    const childVariant: "default" | "minimal" = props.childrenVariant ? props.childrenVariant : "default";
    const actionEvents = props.actionEvents ? props.actionEvents : [];
    const actionCallback = props.onActionClick ? props.onActionClick : handleAction;

    let buttons:Array<ActionButtonInterface> = new Array<ActionButtonInterface>;

    actionEvents.map((eventIdentifier:string) => {
        buttons.push(getActionButton(eventIdentifier as string));
    })

    let miscProperties = propertiesForContentInformation(data.parentResource.id, data, buttons, false);

    return (
        <DataCard key={data.parentResource.id}
                  variant={variant}
                  childrenVariant={childVariant}
                  onActionClick={ev => actionCallback(ev)} {...miscProperties}></DataCard>
    )
}

