'use client'

import {DataCard} from "data-card-react";
import {
    getChildren,
    getDescription, getMetadata,
    getSubtitle,
    getTags,
    getThumb,
    getTitle
} from "@/app/lib/base-repo/datacard-utils";
import {useDebouncedCallback} from "use-debounce";
import {eventIdentifierToPath} from "@/app/lib/utils";
import {useRouter} from "next/navigation";

export default function DataResourceDataCardWrapper(props) {
    const {replace} = useRouter();
    const key = props.key;
    const data = props.data;
    const variant = props.variant ? props.variant : "default";

    const handleAction = useDebouncedCallback((event) => {
        const eventIdentifier: string = event.detail.eventIdentifier;
        replace(eventIdentifierToPath(eventIdentifier));
    });

    let buttons = [{
        "label": "Edit",
        "iconName": "material-symbols-light:edit-square-outline",
        "eventIdentifier": "editResource_" + data.id,
    },
        {
            "label": "Download",
            "iconName": "material-symbols-light:download",
            "eventIdentifier": "downloadResource_" + data.id,
        }];

    if (variant != "detailed") {
        buttons.push({
            "label": "View",
            "iconName": "material-symbols-light:edit-square-outline",
            "eventIdentifier": "viewResource_" + data.id,
        });
    }

    return (
        <div>
            <DataCard
                variant={variant}
                children-variant="default"
                key={key}
                data-title={getTitle(data)}
                sub-title={getSubtitle(data)}
                image-url={getThumb(data)}
                body-text={getDescription(data)}
                textRight={{'label': data.publisher, 'value': data.publicationYear}}
                children-data={getChildren(data)}
                tags={getTags(data)}
                metadata={getMetadata(data)}
                actionButtons={buttons}
                onActionClick={ev => handleAction(ev)}
            >
            </DataCard>
        </div>
    )
}

