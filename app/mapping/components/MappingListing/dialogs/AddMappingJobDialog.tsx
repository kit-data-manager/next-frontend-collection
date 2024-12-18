import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import React, {useEffect, useState} from "react";
import MappingUpload from "@/app/mapping/components/MappingUpload/MappingUpload";
import {JobStatus, Mapping, MappingPlugin} from "@/lib/mapping/definitions";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {Terminal, Info} from "lucide-react";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@radix-ui/react-collapsible";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {cn} from "@/lib/utils";
import {Icon} from "@iconify/react";

interface AddTagDialogProps {
    openModal: boolean;
    mappings: Mapping[];
    dialogCloseCallback: Function;
    singleUploadFinishedCallback: Function;
    allUploadsFinishedCallback: Function;
}

export function AddMappingJobDialog({openModal, mappings, dialogCloseCallback, singleUploadFinishedCallback, allUploadsFinishedCallback}: AddTagDialogProps) {
    const [mappingDescription, setMappingDescription] = useState<string | undefined>(undefined);
    const [selectedMapping, setSelectedMapping] = useState<Mapping | undefined>(undefined);
    const [mappingPlugin, setMappingPlugin] = useState<MappingPlugin | undefined>(undefined);
    const [uploadEnabled, setUploadEnabled] = useState<boolean>(false);

    useEffect(() => {
        //reset UI if modal state changes
        setMappingDescription(undefined);
        setSelectedMapping(undefined);
        setMappingPlugin(undefined);
        setUploadEnabled(false);
    }, [openModal]);

    function updateValue(selection: string) {
        console.log("CHANGE ", selection);
        const selectedMapping: Mapping | undefined = mappings.find((mapping: Mapping) => mapping.mappingId === selection);
        if (selectedMapping) {
            setUploadEnabled(true);
            setMappingDescription(selectedMapping.description);
            setSelectedMapping(selectedMapping);
            setMappingPlugin(selectedMapping.plugin);
        }
    }

    function mappingResultReceived(file:string, body: JobStatus) {
        singleUploadFinishedCallback(selectedMapping?.mappingId, file, body);
    }

    function mappingUploadComplete(body: JobStatus) {
       allUploadsFinishedCallback();
    }

    return (
        <Dialog open={openModal} modal={true} onOpenChange={() => dialogCloseCallback(false)}>
            <DialogContent className="bg-secondary">
                <DialogHeader>
                    <DialogTitle>Schedule Mapping Jobs(s)</DialogTitle>
                    <div>
                        <Select onValueChange={updateValue}>
                            <SelectTrigger className="w-full mt-2 mb-2">
                                <SelectValue placeholder="Please select a Mapping"/>
                            </SelectTrigger>
                            <SelectContent>
                                {mappings.map((mapping: Mapping) => {
                                    return (<SelectItem key={mapping.mappingId}
                                                        value={mapping.mappingId}>{mapping.title}</SelectItem>)
                                })}
                            </SelectContent>
                        </Select>
                    </div>
                    {mappingDescription ?
                        (
                            <Collapsible>
                                <CollapsibleTrigger className={"hover:underline"}>
                                    <div className={"flex"}><Icon
                                        icon={"material-symbols-light:help-outline"}
                                        className={"h-5 w-5 mr-2 "}
                                        style={{color: "#0F0"}}/>
                                        Click to Open Mapping Description
                                    </div>
                                </CollapsibleTrigger>
                                <CollapsibleContent>
                                    <Card className={cn("w-full bg-accent")}>
                                        <CardHeader>
                                            <CardTitle>{selectedMapping?.mappingId} </CardTitle>
                                            <CardDescription>{selectedMapping?.description}</CardDescription>
                                        </CardHeader>
                                        <CardContent className="grid gap-4">
                                            <div>
                                                {
                                                    <div
                                                        className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                                                    >
                                                         <span
                                                             className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500"/>
                                                        <div className="space-y-1">
                                                            <p className="text-sm font-medium leading-none">
                                                                <b>Plugin:</b> {mappingPlugin?.name} v{mappingPlugin?.version}
                                                            </p>
                                                        </div>
                                                        <span
                                                            className="flex h-2 w-2 translate-y-3 rounded-full bg-sky-500"/>
                                                        <div className="translate-y-2">
                                                            <p className="text-sm font-medium leading-none">
                                                                <b>Inputs:</b> {mappingPlugin?.inputTypes.join(", ")}
                                                            </p>
                                                        </div>
                                                        <span
                                                            className="flex h-2 w-2 translate-y-5 rounded-full bg-sky-500"/>
                                                        <div className="translate-y-4">
                                                            <p className="text-sm font-medium leading-none">
                                                                <b>Outputs:</b> {mappingPlugin?.outputTypes.join(", ")}
                                                            </p>
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                        </CardContent>
                                        <CardFooter>
                                        </CardFooter>
                                    </Card>
                                </CollapsibleContent>
                            </Collapsible>

                        )
                        : undefined}
                    {uploadEnabled ?
                        <MappingUpload mappingId={selectedMapping ? selectedMapping.mappingId : ""}
                            fileTypes={mappingPlugin?.inputTypes} singleUploadCallback={mappingResultReceived}
                                       uploadCompleteCallback={mappingUploadComplete}/>
                        : <Alert className={"bg-accent"}>
                            <Info className="h-4 w-4" />
                            <AlertTitle>Selection Required</AlertTitle>
                            <AlertDescription>
                                Please select a mapping on order to be able to upload inputs.
                            </AlertDescription>
                        </Alert>}
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}
