'use client';

import {DataResource} from "@/lib/definitions";
import {userCanDownload, userCanEdit, userCanView} from "@/lib/event-utils";
import React from "react";
import {ActionButtonInterface} from "@/app/base-repo/components/DataResourceCard/DataResourceCard.d";
import {ViewSchemaAction} from "@/lib/actions/metastore/viewSchemaAction";
import {EditSchemaAction} from "@/lib/actions/metastore/editSchemaAction";
import SchemaCard from "@/app/metastore/components/SchemaCard/SchemaCard";
import {DownloadSchemaAction} from "@/lib/actions/metastore/downloadSchemaAction";
import {CreateMetadataAction} from "@/lib/actions/metastore/createMetadataAction";
import {fetchMetadataRecords} from "@/lib/metastore/client-data";
import {GenericListing} from "@/components/GenericListing/GenericListing";
import {ActionEvent, DataCardCustomEvent} from "@kit-data-manager/data-view-web-component";

export default function SchemaListing(props) {
    return (
        <GenericListing
            {...props}
            backRef="/metastore/"
            fetchPage={(page, size, sort, token) =>
                fetchMetadataRecords("schema", page, size, sort, token)
            }
            buildActions={(resource: DataResource, session) => {
                const actions: ActionButtonInterface[] = [];
                let addCreate: boolean = false;

                if (userCanView(resource, session?.user)) {
                    if(session?.user){
                        addCreate = true;
                    }
                    actions.push(new ViewSchemaAction(resource.id).getDataCardAction());
                }

                if (userCanEdit(resource, session?.user)) {
                    actions.push(new EditSchemaAction(resource.id).getDataCardAction());
                }

                if (userCanDownload(resource, session?.user)) {
                    actions.push(new DownloadSchemaAction(resource.id, "schema", resource.resourceType.value === "JSON_Schema" ? "json" : "xml").getDataCardAction());
                }

                if (addCreate) {
                    actions.push(new CreateMetadataAction(resource.id, resource.resourceType.value === "JSON_Schema" ? "json" : "xml", resource.version).getDataCardAction());
                }
                return actions;
            }}
            renderCard={({resource, actionEvents, onAction}:
                         {
                             resource:DataResource,
                             actionEvents: ActionButtonInterface[],
                             onAction: (action: DataCardCustomEvent<ActionEvent>, resource: DataResource) => void
                         } ) => (
                <SchemaCard
                    schemaRecord={resource}
                    detailed={false}
                    actionEvents={actionEvents}
                    cardCallbackAction={onAction}
                />
            )}
        />
    );
}
