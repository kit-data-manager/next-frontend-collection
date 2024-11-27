'use client'

import {useDebouncedCallback} from "use-debounce";
import {useRouter} from "next/navigation";
import {ActionButtonInterface} from "@/app/base-repo/components/DataResourceCard/DataResourceCard.d";
import React, {useEffect, useState} from "react";
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
import {fetchMappingDocument, fetchMappingPlugins} from "@/lib/mapping/client_data";
import {Tag} from "@/lib/definitions";
import {TextPropType} from "@kit-data-manager/data-view-web-component";
import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import MappingUpload from "@/app/mapping/components/MappingUpload/MappingUpload";
import {JobChildCard, JobStatus, Status} from "@/lib/mapping/definitions";
import useMappingStore, {JobStore} from "@/app/mapping/components/MappingListing/MappingStore";
import {Textarea} from "@/components/ui/textarea";
import {mimeTypeToExtension} from "@/lib/fileUtils";

export default function MappingCard(props: MappingCardProps) {
    const {data, status} = useSession();
    const [tags, setTags] = useState([] as Tag[]);
    const [children, setChildren] = useState([] as JobChildCard[]);
    const [textRight, setTextRight] = useState({'label': "Plugin", 'value': "Loading..."} as TextPropType);
    const [fileTypes, setFileTypes] = useState([] as string[]);
    const [mappingDocument, setMappingDocument] = useState("");
    const [openAddJobsModal, setOpenAddJobsModal] = useState(false);
    const [openViewSchemaModal, setOpenViewSchemaModal] = useState(false);

    const router = useRouter();
    const mapping = props.data;

    const variant = "default";
    const childVariant = "default";
    const actionEvents: ActionButtonInterface[] = props.actionEvents ? props.actionEvents : [] as ActionButtonInterface[];
    const regCallback = props.jobRegistrationCallback;
    const regCompleteCallback = props.jobRegistrationCompleteCallback;
    const unRegCallback = props.jobUnregistrationCallback;
    let buttons: Array<ActionButtonInterface> = new Array<ActionButtonInterface>;
    const jobStore: JobStore = useMappingStore.getState();

    const handleAction = useDebouncedCallback((event) => {
        const eventIdentifier: string = event.detail.eventIdentifier;
        if (eventIdentifier.startsWith("run")) {
            setOpenAddJobsModal(true);
        } else if (eventIdentifier === "view") {
            fetchMappingDocument(mapping.mappingId).then((result) => {
                setMappingDocument(result);
            }).then(() => {
                setOpenViewSchemaModal(true);
            })
        } else if (eventIdentifier === "cleanup") {
            const idsToRemove: string[] = [];
            jobStore.mappingStatus.map((status: JobStatus) => {
                if (status.mappingId === mapping.mappingId) {
                    if (status.status === Status.SUCCEEDED || status.status === Status.FAILED) {
                        idsToRemove.push(status.jobId);
                    }
                }
            })
            unRegCallback(idsToRemove);
            regCompleteCallback();
        } else {
            let parts: string[] = eventIdentifier.split("_");
            if (parts[0] === "deleteJob") {
                unRegCallback([parts[1]]);
                regCompleteCallback();
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

                        const inputTypes: string[] = []
                        plugin.inputTypes.map((type) => {
                            inputTypes.push(mimeTypeToExtension(type));
                        });
                        setFileTypes(inputTypes);
                    }
                });
                setTags(tagsForMapping(mapping));
                setTextRight(textRightForMapping(mapping));
            }).then(() => {
                let childrenData: Array<JobChildCard> = new Array<DataCard>;
                jobStore.mappingStatus.map((status: JobStatus) => {
                    if (status.mappingId === mapping.mappingId) {
                        const props = propertiesForMappingJob(status);
                        props.onActionClick = {actionCallback};
                        props.actionButtons = actionsForJobStatus(status);
                        childrenData.push(props);
                    }
                })
                setChildren(childrenData);
            });
        })
    }, [data?.accessToken, mapping.mappingId]);


    actionEvents.map((actionEvent: ActionButtonInterface) => {
        buttons.push(actionEvent);
    });

    function closeModal() {
        setOpenAddJobsModal(false);
        setOpenViewSchemaModal(false)
    }

    function mappingResultReceived(body: JobStatus) {
        regCallback(mapping.mappingId, body);
    }

    function mappingUploadComplete(body: JobStatus) {
        setOpenAddJobsModal(false);
        regCompleteCallback();
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

            <Dialog open={openAddJobsModal} modal={true} onOpenChange={closeModal}>
                <DialogContent className="bg-secondary">
                    <DialogHeader>
                        <DialogTitle>Schedule Mapping Jobs(s)</DialogTitle>
                        <DialogDescription className="secondary">
                            Please select one or more files and upload them to schedule mapping jobs.
                        </DialogDescription>
                        <MappingUpload id={mapping.mappingId}
                                       fileTypes={fileTypes}
                                       mappingCallback={mappingResultReceived}
                                       uploadCompleteCallback={mappingUploadComplete}/>
                    </DialogHeader>
                </DialogContent>
            </Dialog>

            <Dialog open={openViewSchemaModal} modal={true} onOpenChange={closeModal}>
                <DialogContent className="bg-secondary">
                    <DialogHeader>
                        <DialogTitle>Mapping Document</DialogTitle>
                        <DialogDescription className="secondary">
                            {`The mapping document for mapping ${mapping.mappingId}.`}
                        </DialogDescription>
                        <Textarea value={mappingDocument} readOnly/>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </>
    )
}

