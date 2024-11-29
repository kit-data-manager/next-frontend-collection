'use client'

import {
    propertiesForContentInformation,
    propertiesForDataResource,
    thumbFromContentArray
} from "@/lib/base-repo/datacard-utils";
import {useDebouncedCallback} from "use-debounce";
import {useRouter} from "next/navigation";
import {ActionButtonInterface, ResourceCardProps} from "@/app/base-repo/components/DataResourceCard/DataResourceCard.d";
import React, {useEffect, useState} from "react";
import {runAction} from "@/lib/base-repo/actions/actionExecutor";
import {fetchAllContentInformation} from "@/lib/base-repo/client_data";
import {DownloadContentAction} from "@/lib/base-repo/actions/downloadContentAction";
import {DataCard} from "@kit-data-manager/data-view-web-component-react/dist/components";
import {useSession} from "next-auth/react";

export default function DataResourceCard(props:ResourceCardProps) {
    const {data, status} = useSession();

    const [childrenData, setChildrenData] = useState([] as DataCard[]);
    const [childrenLabel, setChildrenLabel] = useState("Loading...");
    const [thumb, setThumb] = useState("/data.png");

    const router = useRouter();
    const resource = props.data;
    const variant:"default"|"detailed"|"minimal" | undefined = props.variant ? props.variant : "default";
    const childVariant: "default" | "minimal" = props.childrenVariant ? props.childrenVariant : "default";
    const actionEvents:ActionButtonInterface[] = props.actionEvents ? props.actionEvents : [] as ActionButtonInterface[];
    let buttons:Array<ActionButtonInterface> = new Array<ActionButtonInterface>;

    const handleAction = useDebouncedCallback((event) => {
        const eventIdentifier: string = event.detail.eventIdentifier;

        runAction(eventIdentifier, (redirect:string) => {
            router.push(redirect);
        });
    });

    const actionCallback = props.onActionClick ? props.onActionClick : handleAction;

    useEffect(() => {
        new Promise(r => setTimeout(r, 1000)).then(() => {
        fetchAllContentInformation(resource, data?.accessToken).then(contentInformation => {
            let children:Array<DataCard> = new Array<DataCard>;

            let thumb = thumbFromContentArray(contentInformation);

            contentInformation.map(element => {
                let actionButtons = [
                    //only add download button
                    new DownloadContentAction(resource.id, element.relativePath).getDataCardAction()
                ];
                children.push(propertiesForContentInformation(resource.id, element, actionButtons, true) as DataCard);
            })
            setChildrenLabel("File(s)");
            setThumb(thumb);
            setChildrenData(children);
        });
        })
    }, [data?.accessToken, resource.id]);

    actionEvents.map((actionEvent:ActionButtonInterface) => {
        buttons.push(actionEvent);
    })

    let miscProperties = propertiesForDataResource(resource);
    miscProperties.childrenData = childrenData;
    miscProperties.childrenLabel = childrenLabel;
    miscProperties.imageUrl = thumb;
    return (
        <>
            <DataCard key={resource.id}
                  variant={variant}
                  childrenVariant={childVariant}
                  actionButtons={buttons}
                  onActionClick={ev => actionCallback(ev)} {...miscProperties}></DataCard>
        </>
    )
}

