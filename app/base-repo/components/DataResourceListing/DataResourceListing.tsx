"use client";
import {GenericListing} from "@/components/GenericListing/GenericListing";
import {fetchDataResources} from "@/lib/base-repo/client-data";
import {userCanDownload, userCanEdit, userCanView} from "@/lib/event-utils";
import {ViewResourceAction} from "@/lib/actions/base-repo/viewResourceAction";
import {EditResourceAction} from "@/lib/actions/base-repo/editResourceAction";
import {DownloadResourceAction} from "@/lib/actions/base-repo/downloadResourceAction";
import DataResourceCard from "@/app/base-repo/components/DataResourceCard/DataResourceCard";
import {DataResource} from "@/lib/definitions";
import {ActionButtonInterface} from "@/app/base-repo/components/DataResourceCard/DataResourceCard.d";
import {ActionEvent, DataCardCustomEvent} from "@kit-data-manager/data-view-web-component";

export default function DataResourceListing(props) {
    return (
        <GenericListing
            {...props}
            backRef="/base-repo/"
            fetchPage={(page, size, sort, token) =>
                fetchDataResources(page, size, props.filter, sort!, token)
            }
            buildActions={(resource: DataResource, session) => {
                const actions: ActionButtonInterface[] = [];
                if (userCanView(resource, session?.user)) {
                    actions.push(new ViewResourceAction(resource.id).getDataCardAction());
                }
                if (userCanEdit(resource, session?.user)) {
                    actions.push(new EditResourceAction(resource.id).getDataCardAction());
                }
                if (userCanDownload(resource, session?.user)) {
                    actions.push(new DownloadResourceAction(resource.id).getDataCardAction());
                }
                return actions;
            }}
            renderCard={({resource, actionEvents, onAction}:
                         {
                             resource:DataResource,
                             actionEvents: ActionButtonInterface[],
                             onAction: (action: DataCardCustomEvent<ActionEvent>, resource: DataResource) => void
                         } ) => (
                <DataResourceCard
                    resource={resource}
                    actionEvents={actionEvents}
                    cardCallbackAction={onAction}
                />
            )}
        />
    );
}
