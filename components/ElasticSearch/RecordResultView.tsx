import React from "react";
import {DataCard} from "@kit-data-manager/data-view-web-component-react/dist/components";
import {propertiesForDataResource, thumbFromContentArray} from "@/lib/base-repo/datacard-utils";
import {ContentInformation, DataResource} from "@/lib/definitions";
import {ActionButtonInterface} from "@/app/base-repo/components/DataResourceCard/DataResourceCard.d";
import {ViewResourceAction} from "@/lib/actions/base-repo/viewResourceAction";
import {runAction} from "@/lib/actions/action-executor";
import {useSession} from "next-auth/react";
import {useRouter} from "next/navigation";
import {ViewMetadataDocumentAction} from "@/lib/actions/metastore/viewMetadataDocumentAction";

export interface RecordResultViewProps {
    /**
     * Search result that will be rendered in this view.
     */
    result: Record<string, unknown>
}

type RepoResultType = {
    _meta: {rawHit: {_index:string;}}
    metadata:{raw:DataResource}
    content:{raw:ContentInformation[]}
}

type MetaStoreResultType = {
    _meta: {rawHit: {_index:string;}}
    metadataRecord:{raw:DataResource}
    metadataDocument:{raw:ContentInformation[]}
}

function extractDataResource(result): DataResource {
    if ("metadata" in result) {
        // RepoResultType
        return result.metadata.raw;
    } else {
        // MetaStoreResultType
        return result.metadataRecord.raw;
    }
}

function extractContentInformation(result): ContentInformation[] {
    if ("metadata" in result) {
        // RepoResultType
        return result.content.raw;
    } else {
        // MetaStoreResultType
        return [];
    }
}
function getActionsByResultType(result): ActionButtonInterface[] {
    const actionEvents: ActionButtonInterface[] = [];
    if ("metadata" in result) {
        // RepoResultType
        actionEvents.push(new ViewResourceAction(result.id).getDataCardAction());
    } else {
        // MetaStoreResultType
        actionEvents.push(new ViewMetadataDocumentAction(result.metadataRecord.id).getDataCardAction());
    }

    return actionEvents;
}

export function RecordResultView({
                                     result
                                 }: RecordResultViewProps) {
    const {data, status} = useSession();
    const router = useRouter();

    const res:DataResource = extractDataResource(result);
    const dataViewProps = propertiesForDataResource(res);
    dataViewProps.imageUrl = thumbFromContentArray(extractContentInformation(result) as ContentInformation[]);

    function cardCallbackAction(ev, res){
        const eventIdentifier: string = ev.detail.eventIdentifier;

        runAction(eventIdentifier, data?.accessToken, (redirect: string) => {
            router.push(redirect);
        });
    }

    const actionEvents: ActionButtonInterface[] = getActionsByResultType(result);

    return (
        <>
            <DataCard childrenVariant={"default"}
                      actionButtons={actionEvents}
                      onActionClick={ev => cardCallbackAction(ev, res)}
                      {...dataViewProps}></DataCard>
        </>
    )
}
