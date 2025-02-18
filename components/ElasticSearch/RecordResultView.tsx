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

type ResultType = {
    _meta: {rawHit: {_index:string;}}
    metadata:{raw:DataResource}
    content:{raw:ContentInformation[]}
}

export function RecordResultView({
                                     result
                                 }: RecordResultViewProps) {
    const {data, status} = useSession();
    const router = useRouter();

    const typedResult:ResultType = result as ResultType;
console.log("RES ", result);
    //console.log("reS ", typedResult._meta.rawHit._index);

    const res:DataResource = typedResult.metadata.raw as DataResource;

    const dataViewProps = propertiesForDataResource(res);
    dataViewProps.imageUrl = thumbFromContentArray(typedResult.content.raw as ContentInformation[]);

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
