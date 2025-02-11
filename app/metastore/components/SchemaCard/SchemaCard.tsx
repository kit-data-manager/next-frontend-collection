'use client'

import {ActionButtonInterface} from "@/app/base-repo/components/DataResourceCard/DataResourceCard.d";
import React, {useEffect} from "react";
import {DataCard} from "@kit-data-manager/data-view-web-component-react/dist/components";
import {DataResource} from "@/lib/definitions";
import {propertiesForSchema} from "@/lib/metastore/datacard-utils";
import {ActionEvent, DataCardCustomEvent} from "@kit-data-manager/data-view-web-component";
import {useSession} from "next-auth/react";
import {fetchMetadataSchemaEtag} from "@/lib/metastore/client-data";

export interface SchemaCardProps {
    schemaRecord: DataResource;
    actionEvents?: ActionButtonInterface[];
    cardCallbackAction: (action: DataCardCustomEvent<ActionEvent>, resource: DataResource) => void;
}

export default function SchemaCard({
                                       schemaRecord,
                                       actionEvents = [] as ActionButtonInterface[],
                                       cardCallbackAction
                                   }: SchemaCardProps) {
    const {data, status} = useSession();

    /**
     * Effect fetching the schema's ETag. The effect is triggered if authentication information or the schema changes.
     */
    useEffect(() => {
        fetchMetadataSchemaEtag(schemaRecord.id, data?.accessToken).then((etag) => {
            schemaRecord.etag = etag;
        })
    }, [data?.accessToken, schemaRecord]);

    let miscProperties = propertiesForSchema(schemaRecord);

    return (
        <>
            <DataCard key={schemaRecord.id}
                      actionButtons={actionEvents}
                      onActionClick={ev => cardCallbackAction(ev, schemaRecord)} {...miscProperties}></DataCard>
        </>
    )
}

