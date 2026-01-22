'use client';

import {DataResource} from "@/lib/definitions";
import {userCanDownload, userCanEdit, userCanView} from "@/lib/event-utils";
import React from "react";
import {ActionButtonInterface} from "@/app/base-repo/components/DataResourceCard/DataResourceCard.d";
import MetadataDocumentCard from "@/app/metastore/components/MetadataDocumentCard/MetadataDocumentCard";
import {fetchMetadataRecords} from "@/lib/metastore/client-data";
import {ViewMetadataDocumentAction} from "@/lib/actions/metastore/viewMetadataDocumentAction";
import {EditMetadataDocumentAction} from "@/lib/actions/metastore/editMetadataDocumentAction";
import {DownloadMetadataDocumentAction} from "@/lib/actions/metastore/downloadMetadataDocumentAction";
import {GenericListing} from "@/components/GenericListing/GenericListing";
import {ActionEvent, DataCardCustomEvent} from "@kit-data-manager/data-view-web-component";

export default function MetadataDocumentListing(props) {

    return (
        <GenericListing
            {...props}
            backRef="/metastore/"
            fetchPage={(page, size, sort, token) =>
                fetchMetadataRecords("schema", page, size, sort, token)
            }
            buildActions={(resource: DataResource, session) => {
                const actions: ActionButtonInterface[] = [];

                if (userCanView(resource, session?.user)) {
                    actions.push(new ViewMetadataDocumentAction(resource.id).getDataCardAction());
                }

                if (userCanEdit(resource, session?.user)) {
                    actions.push(new EditMetadataDocumentAction(resource.id).getDataCardAction());
                }

                if (userCanDownload(resource, session?.user)) {
                    actions.push(new DownloadMetadataDocumentAction(resource.id, "schema", resource.resourceType.value === "JSON_Schema" ? "json" : "xml").getDataCardAction());
                }
                return actions;
            }}
            renderCard={({resource, actionEvents, onAction}:
                         {
                             resource:DataResource,
                             actionEvents: ActionButtonInterface[],
                             onAction: (action: DataCardCustomEvent<ActionEvent>, resource: DataResource) => void
                         } ) => (
                <MetadataDocumentCard
                    metadataRecord={resource}
                    detailed={false}
                    actionEvents={actionEvents}
                    cardCallbackAction={onAction}
                />
            )}
        />
    );
}
