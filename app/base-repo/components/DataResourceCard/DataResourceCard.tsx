'use client'

import {DataCard} from "data-card-react";
import {propertiesForDataResource} from "@/lib/base-repo/datacard-utils";
import {useDebouncedCallback} from "use-debounce";
import {useRouter} from "next/navigation";
import {ActionButtonInterface, ResourceCardProps} from "@/app/base-repo/components/DataResourceCard/DataResourceCard.d";
import React from "react";
import {runAction} from "@/lib/base-repo/actions/actionExecutor";

export default function DataResourceCard(props:ResourceCardProps) {
  /*  const {data, status} = useSession();
    const [etag, setEtag] = useState('' as string);
*/
    const router = useRouter();
    const resource = props.data;
    const variant:"default"|"detailed"|"minimal" | undefined = props.variant ? props.variant : "default";
    const childVariant: "default" | "minimal" = props.childrenVariant ? props.childrenVariant : "default";
    const actionEvents:ActionButtonInterface[] = props.actionEvents ? props.actionEvents : [] as ActionButtonInterface[];
    let buttons:Array<ActionButtonInterface> = new Array<ActionButtonInterface>;

    const handleAction = useDebouncedCallback((event) => {
        const eventIdentifier: string = event.detail.eventIdentifier;
        console.log("ID ", eventIdentifier);
        runAction(eventIdentifier, (redirect:string) => {
          //  setEtag("");
            router.push(redirect);
        });
    });

    const actionCallback = props.onActionClick ? props.onActionClick : handleAction;

  /*  useEffect(() => {
        fetchDataResourceEtag(resource.id, data?.accessToken).then(result => setEtag(result as string));
    }, [data?.accessToken, etag, resource.id]);

    if(!etag){
        return "Waiting for etag...";
    }*/

    actionEvents.map((actionEvent:ActionButtonInterface) => {
        buttons.push(actionEvent);
    })

    let miscProperties = propertiesForDataResource(resource);
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

