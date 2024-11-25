'use client'

import {useDebouncedCallback} from "use-debounce";
import {useRouter} from "next/navigation";
import {ActionButtonInterface} from "@/app/base-repo/components/DataResourceCard/DataResourceCard.d";
import React, {useEffect, useMemo, useState} from "react";
import {DataCard} from "@kit-data-manager/data-view-web-component-react/dist/components";
import {useSession} from "next-auth/react";
import {
    actionsForJobStatus,
    propertiesForMapping,
    propertiesForMappingJob,
    tagsForMapping,
    textRightForMapping
} from "@/lib/mapping/datacard_utils";
import {MappingCardProps} from "@/app/mapping/components/MappingCard/MappingCard.d";
import {deleteMappingJobStatus, fetchMappingJobStatus, fetchMappingPlugins} from "@/lib/mapping/client_data";
import {Tag} from "@/lib/definitions";
import {TextPropType} from "@kit-data-manager/data-view-web-component";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import MappingUpload from "@/app/mapping/components/MappingUpload/MappingUpload";
import {JobChildCard, JobStatus, Status} from "@/lib/mapping/definitions";
import useUserPrefs from "@/lib/hooks/userUserPrefs";
import {Timeout} from "@mui/utils/useTimeout";

export default function MappingCard2(props: MappingCardProps) {
    const {data, status} = useSession();
    const [tags, setTags] = useState([] as Tag[]);
    const [children, setChildren] = useState([] as JobChildCard[]);
    const [textRight, setTextRight] = useState({'label': "Plugin", 'value': "Loading..."} as TextPropType);
    const [openModal, setOpenModal] = useState(false);

    const router = useRouter();
    const mapping = props.data;

    const variant = "default";
    const childVariant = "default";
    const actionEvents: ActionButtonInterface[] = props.actionEvents ? props.actionEvents : [] as ActionButtonInterface[];
    const regCallback = props.jobRegistrationCallback;
    const unRegCallback = props.jobUnregistrationCallback;
    let buttons: Array<ActionButtonInterface> = new Array<ActionButtonInterface>;
    const {userPrefs, updateUserPrefs} = useUserPrefs(data?.user.id);

   const handleAction = useDebouncedCallback((event) => {
        const eventIdentifier: string = event.detail.eventIdentifier;
        console.log("MappingCard ActionId ", eventIdentifier);
        console.log("In CARD ", mapping.mappingId);
        if (eventIdentifier.startsWith("run")) {
            setOpenModal(true);
        } else if (eventIdentifier === "view") {

        } else {
            let parts: string[] = eventIdentifier.split("_");
            if (parts[0] === "deleteJob") {
                deleteMappingJobStatus(parts[1]).then((result) => {
                    console.log("Removal result: ", result);
                    unRegCallback(mapping.mappingId, parts[1]);
                });
            }
        }
    });

    const actionCallback = props.onActionClick ? props.onActionClick : handleAction;

    useEffect(() => {
        new Promise(r => setTimeout(r, 0)).then(() => {
            fetchMappingPlugins(data?.accessToken).then(plugins => {
                plugins.map(plugin => {
                    if (plugin.id === mapping.mappingType) {
                        mapping.plugin = plugin;
                    }
                });
                setTags(tagsForMapping(mapping));
                setTextRight(textRightForMapping(mapping));
            }).then(() => {

                let copy: Map<string, JobStatus[]> = new Map(JSON.parse(userPrefs.mappingJobs));
                if(copy.get(mapping.mappingId)){
                    let childrenData: Array<JobChildCard> = new Array<DataCard>;
                    copy.get(mapping.mappingId)?.map((status: JobStatus) => {
                        console.log("The job ", status);
                        const props = propertiesForMappingJob(status);
                        props.onActionClick = {actionCallback};
                        props.actionButtons = actionsForJobStatus(status);
                        childrenData.push(props);
                    })
                    setChildren(childrenData);
                }
            });
        })
    }, [data?.accessToken, mapping.mappingId]);


    actionEvents.map((actionEvent: ActionButtonInterface) => {
        buttons.push(actionEvent);
    });

    function closeModal() {
        setOpenModal(false);
    }

    function mappingResultReceived(body: JobStatus) {
        setOpenModal(false);
        regCallback(mapping.mappingId, body);
    }

    let miscProperties = propertiesForMapping(mapping);
    miscProperties.textRight = textRight;
    miscProperties.tags = tags;
    miscProperties.childrenData = children;
    return (
        <>
            <DataCard key={mapping.mappingId}
                      variant={variant}
                      childrenVariant={childVariant}
                      actionButtons={buttons}
                      onActionClick={ev => actionCallback(ev)} {...miscProperties}></DataCard>
            <Dialog open={openModal} modal={true} onOpenChange={closeModal}>
                <DialogContent className="bg-secondary">
                    <DialogHeader>
                        <DialogTitle>Add New Tag</DialogTitle>
                        <DialogDescription className="secondary">
                            Provide a tag to add to this content element.
                        </DialogDescription>
                        <MappingUpload id={mapping.mappingId} mappingCallback={mappingResultReceived}/>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    )
}

