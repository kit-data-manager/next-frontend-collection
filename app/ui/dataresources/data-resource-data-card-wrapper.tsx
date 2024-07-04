'use client'

import { DataCard } from "data-card-react";
import {getDescription, getSubtitle, getTags, getThumb, getTitle} from "@/app/lib/base-repo/datacard-utils";
import {useDebouncedCallback} from "use-debounce";
import {eventIdentifierToPath} from "@/app/lib/utils";
import {useRouter} from "next/navigation";

export default function DataResourceDataCardWrapper(props){
    const { replace } = useRouter();
    const key = props.key;
    const data = props.data;

    const handleAction = useDebouncedCallback((event) => {
        const eventIdentifier:string = event.detail.eventIdentifier;
        replace(eventIdentifierToPath(eventIdentifier));
    });

    return(
        <div>
            <DataCard
                variant="default"
                children-variant="default"
                key={key}
                data-title={getTitle(data)}
                sub-title={getSubtitle(data)}
                image-url={getThumb(data)}
                body-text={getDescription(data)}
                textRight={{'label': data.publisher, 'value': data.publicationYear}}
                children-data={undefined}
                tags={getTags(data)}
                actionButtons={[{
                "label": "View",
                "urlTarget": "_self",
                "iconName": "material-symbols-light:edit-square-outline",
                "eventIdentifier": "viewResource_" + data.id,
            },{
                "label": "Edit",
                "urlTarget": "_self",
                "iconName": "material-symbols-light:edit-square-outline",
                "eventIdentifier": "editResource_" + data.id,
            },
            {
                "label": "Download",
                "iconName": "material-symbols-light:download",
                "urlTarget": "_blank",
                "eventIdentifier": "downloadResource_" + data.id,
            }]}
                onActionClick={ev => handleAction(ev)}
            >
            </DataCard>
        </div>
    )
}

