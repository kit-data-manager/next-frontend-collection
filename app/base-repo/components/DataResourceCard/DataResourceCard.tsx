'use client'

import {
    propertiesForContentInformation,
    propertiesForDataResource,
    thumbFromContentArray
} from "@/lib/base-repo/datacard-utils";
import {ActionButtonInterface} from "@/app/base-repo/components/DataResourceCard/DataResourceCard.d";
import React, {useEffect, useState} from "react";
import {fetchAllContentInformation, fetchDataResourceEtag} from "@/lib/base-repo/client-data";
import {DownloadContentAction} from "@/lib/actions/base-repo/downloadContentAction";
import {useSession} from "next-auth/react";

import {DataCard} from "@kit-data-manager/data-view-web-component-react/dist/components";
import {DataResource} from "@/lib/definitions";
import {ActionEvent, DataCardCustomEvent} from "@kit-data-manager/data-view-web-component";

export interface ResourceCardProps {
    resource: DataResource;
    variant?: string;
    actionEvents?: ActionButtonInterface[];
    cardCallbackAction: (action: DataCardCustomEvent<ActionEvent>, resource: DataResource) => void;
}

export default function DataResourceCard({
                                             resource,
                                             variant,
                                             actionEvents = [] as ActionButtonInterface[],
                                             cardCallbackAction
                                         }: ResourceCardProps) {
    const {data, status} = useSession();
    const basePath: string = (process.env.NEXT_PUBLIC_BASE_PATH ? process.env.NEXT_PUBLIC_BASE_PATH : "");
    const [childrenData, setChildrenData] = useState([] as DataCard[]);
    const [childrenLabel, setChildrenLabel] = useState("Loading...");
    const [thumb, setThumb] = useState(`${basePath}/data.png`);

    /**
     * Effect fetching the resource's ETag and all content information.
     * The effect is triggered if authentication information or the resource changes.
     */
    useEffect(() => {
        fetchDataResourceEtag(resource.id, data?.accessToken).then((etag) => {
            resource.etag = etag;
        }).then(() => {
            fetchAllContentInformation(resource, data?.accessToken).then(contentInformation => {
                let children: Array<DataCard> = new Array<DataCard>;

                let thumb = thumbFromContentArray(contentInformation);

                contentInformation.map(element => {
                    let actionButtons = [
                        //only add download button as we do not have access to the content etag if action called via child component
                        //content deletion will only work properly in edit resource view
                        new DownloadContentAction(resource.id, element.relativePath).getDataCardAction()
                    ];
                    children.push(propertiesForContentInformation(resource.id, element, actionButtons, true) as DataCard);
                })
                setChildrenLabel("File(s)");
                setThumb(thumb);
                setChildrenData(children);
            })
        });
    }, [data?.accessToken, resource]);

    let miscProperties = propertiesForDataResource(resource);
    miscProperties.childrenData = childrenData;
    miscProperties.childrenLabel = childrenLabel;
    miscProperties.imageUrl = thumb;

    return (
        <>
            <DataCard key={resource.id}
                      variant={variant ? variant : "default"}
                      childrenVariant={"default"}
                      actionButtons={actionEvents}
                      onActionClick={ev => cardCallbackAction(ev, resource)} {...miscProperties}></DataCard>
        </>
    )
}

