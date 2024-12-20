'use client'

import {DataCard} from "@kit-data-manager/data-view-web-component-react/dist/components";
import {propertiesForContentInformation} from "@/lib/base-repo/datacard-utils";
import {useDebouncedCallback} from "use-debounce";
import {useRouter} from "next/compat/router";
import {ActionButtonInterface} from "@/app/base-repo/components/DataResourceCard/DataResourceCard.d";
import {ContentInformation} from "@/lib/definitions";
import {ContentInformationCardProps} from "@/app/base-repo/components/ContentInformationCard/ContentInformationCard.d";
import {runAction} from "@/lib/actions/actionExecutor";


export default function ContentInformationCard(props:ContentInformationCardProps) {

    const handleAction = useDebouncedCallback((event) => {
        const eventIdentifier: string = event.detail.eventIdentifier;
        runAction(eventIdentifier, (redirect:string) => router?.push(redirect));
    });

    const router = useRouter();
    const data:ContentInformation = props.data;
    const variant:"default"|"detailed"|"minimal" | undefined = props.variant ? props.variant : "default";
    const childVariant: "default" | "minimal" = props.childrenVariant ? props.childrenVariant : "default";
    const actionEvents = props.actionEvents ? props.actionEvents : [];
    const actionCallback = props.onActionClick ? props.onActionClick : handleAction;

    let buttons:Array<ActionButtonInterface> = new Array<ActionButtonInterface>;

    actionEvents.map((actionEvent:ActionButtonInterface) => {
        buttons.push(actionEvent);
    })

    let miscProperties = propertiesForContentInformation(data.parentResource.id, data, buttons, false);

    return (
        <DataCard key={data.parentResource.id}
                  variant={variant}
                  childrenVariant={childVariant}
                  onActionClick={ev => actionCallback(ev)} {...miscProperties}></DataCard>
    )
}

