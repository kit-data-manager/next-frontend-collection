import React from "react";
import {DataCard} from "@kit-data-manager/data-view-web-component-react/dist/components";
import {propertiesForDataResource, thumbFromContentArray} from "@/lib/base-repo/datacard-utils";
import {ContentInformation, DataResource} from "@/lib/definitions";
import {ActionButtonInterface} from "@/app/base-repo/components/DataResourceCard/DataResourceCard.d";
import {ViewResourceAction} from "@/lib/actions/base-repo/viewResourceAction";
import {runAction} from "@/lib/actions/action-executor";
import {useSession} from "next-auth/react";
import {useRouter} from "next/navigation";

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
        // ResultType1
        return result.metadata.raw;
    } else {
        // ResultType2
        return result.metadataRecord.raw;
    }
}

function extractContentInformation(result): ContentInformation[] {
    if ("metadata" in result) {
        // ResultType1
        return result.content.raw;
    } else {
        // ResultType2
        return [];
    }
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

    const actionEvents: ActionButtonInterface[] = [];
    actionEvents.push(new ViewResourceAction(res.id).getDataCardAction());

    return (
        <>
            <DataCard childrenVariant={"default"}
                      actionButtons={actionEvents}
                      onActionClick={ev => cardCallbackAction(ev, res)}
                      {...dataViewProps}></DataCard>
        </>
    )
}
