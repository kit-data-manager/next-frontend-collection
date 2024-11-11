'use client'

import {DataCard} from "data-card-react";
import {propertiesForDataResource} from "@/lib/base-repo/datacard-utils";
import {useDebouncedCallback} from "use-debounce";
import {useRouter} from "next/navigation";

import {
    eventIdentifierToPath,
    getActionButton
} from "@/lib/event-utils";
import {ActionButtonInterface, ResourceCardProps} from "@/app/base-repo/components/DataResourceCard/DataResourceCard.d";
import React from "react";


export default function DataResourceCard(props:ResourceCardProps) {

    const handleAction = useDebouncedCallback((event) => {
        const eventIdentifier: string = event.detail.eventIdentifier;
        replace(eventIdentifierToPath(eventIdentifier));
    });

    const {replace} = useRouter();
    const data = props.data;
    const variant:"default"|"detailed"|"minimal" | undefined = props.variant ? props.variant : "default";
    const childVariant: "default" | "minimal" = props.childrenVariant ? props.childrenVariant : "default";
    const actionEvents = props.actionEvents ? props.actionEvents : [];
    const actionCallback = props.onActionClick ? props.onActionClick : handleAction;

    let buttons:Array<ActionButtonInterface> = new Array<ActionButtonInterface>;

    actionEvents.map((eventIdentifier:string) => {
        buttons.push(getActionButton(eventIdentifier as string));
    })
  //  let [mounted, setMounted] = useState(false);

   /* useEffect(() => {
        setMounted(true);
    }, []);*/

    let miscProperties = propertiesForDataResource(data);

    return (
        <>
        {/*<DataResourceCardSkeleton className={mounted ? "hidden" : "block"}/>*/}
            <DataCard key={data.id}
                  variant={variant}
                  childrenVariant={childVariant}
                  actionButtons={buttons}
                  onActionClick={ev => actionCallback(ev)} {...miscProperties}></DataCard>
        </>
    )
}

