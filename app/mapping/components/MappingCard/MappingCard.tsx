'use client'

import {useDebouncedCallback} from "use-debounce";
import {useRouter} from "next/navigation";
import {ActionButtonInterface} from "@/app/base-repo/components/DataResourceCard/DataResourceCard.d";
import React, {useEffect, useState} from "react";
import {runAction} from "@/lib/base-repo/actions/actionExecutor";
import {DataCard} from "@kit-data-manager/data-view-web-component-react/dist/components";
import {useSession} from "next-auth/react";
import {propertiesForMapping, tagsForMapping, textRightForMapping} from "@/lib/mapping/datacard_utils";
import {MappingCardProps} from "@/app/mapping/components/MappingCard/MappingCard.d";
import {fetchMappingPlugins} from "@/lib/mapping/client_data";
import {Tag} from "@/lib/definitions";
import {TextPropType} from "@kit-data-manager/data-view-web-component";

export default function MappingCard(props:MappingCardProps) {
    const {data, status} = useSession();
    const [tags, setTags] = useState([] as Tag[]);
    const [textRight, setTextRight] = useState({'label': "Plugin", 'value': "Loading..."} as TextPropType);

    const router = useRouter();
    const mapping = props.data;
    const variant:"default"|"detailed"|"minimal" | undefined = props.variant ? props.variant : "default";
    const childVariant: "default" | "minimal" = props.childrenVariant ? props.childrenVariant : "default";
    const actionEvents:ActionButtonInterface[] = props.actionEvents ? props.actionEvents : [] as ActionButtonInterface[];
    let buttons:Array<ActionButtonInterface> = new Array<ActionButtonInterface>;

    const handleAction = useDebouncedCallback((event) => {
        const eventIdentifier: string = event.detail.eventIdentifier;
        console.log("MappingCard ActionId ", eventIdentifier);

        runAction(eventIdentifier, (redirect:string) => {
            router.push(redirect);
        });
    });

    const actionCallback = props.onActionClick ? props.onActionClick : handleAction;

    useEffect(() => {
        new Promise(r => setTimeout(r, 1000)).then(() => {
        fetchMappingPlugins(data?.accessToken).then(plugins => {
            plugins.map(plugin => {
                if(plugin.id === mapping.mappingType){
                    mapping.plugin = plugin;
                }
            });
            setTags(tagsForMapping(mapping));
            setTextRight(textRightForMapping(mapping));
        });
        })
    }, [data?.accessToken, mapping.mappingId]);

    actionEvents.map((actionEvent:ActionButtonInterface) => {
        buttons.push(actionEvent);
    })

    let miscProperties = propertiesForMapping(mapping);
    miscProperties.textRight = textRight;
    miscProperties.tags = tags;
    return (
        <>
            <DataCard key={mapping.mappingId}
                  variant={variant}
                  childrenVariant={childVariant}
                  actionButtons={buttons}
                  onActionClick={ev => actionCallback(ev)} {...miscProperties}></DataCard>
        </>
    )
}

