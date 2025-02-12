'use client'

import {ActionButtonInterface} from "@/app/base-repo/components/DataResourceCard/DataResourceCard.d";
import React, {useEffect} from "react";
import {DataCard} from "@kit-data-manager/data-view-web-component-react/dist/components";
import {DataResource} from "@/lib/definitions";
import {ActionEvent, DataCardCustomEvent} from "@kit-data-manager/data-view-web-component";
import {useSession} from "next-auth/react";
import {fetchMetadataEtag} from "@/lib/metastore/client-data";
import {propertiesForMetadataRecord} from "@/lib/metastore/datacard-utils";

export interface SchemaCardProps {
    metadataRecord: DataResource;
    detailed: boolean;
    actionEvents?: ActionButtonInterface[];
    cardCallbackAction: (action: DataCardCustomEvent<ActionEvent>, resource: DataResource) => void;
}

export default function MetadataDocumentCard({
                                                 metadataRecord,
                                                 detailed,
                                                 actionEvents = [] as ActionButtonInterface[],
                                                 cardCallbackAction
                                             }: SchemaCardProps) {
    const {data, status} = useSession();

    /**
     * Effect fetching the schema's ETag. The effect is triggered if authentication information or the schema changes.
     */
    useEffect(() => {
        fetchMetadataEtag("document", metadataRecord.id, data?.accessToken).then((etag) => {
            metadataRecord.etag = etag;
        })
    }, [data?.accessToken, metadataRecord]);

    let miscProperties = propertiesForMetadataRecord(metadataRecord);

    return (
        <>
            <DataCard key={metadataRecord.id}
                      variant={detailed ? "detailed" : "default"}
                      actionButtons={actionEvents}
                      onActionClick={ev => cardCallbackAction(ev, metadataRecord)} {...miscProperties}></DataCard>
        </>
    )
}

