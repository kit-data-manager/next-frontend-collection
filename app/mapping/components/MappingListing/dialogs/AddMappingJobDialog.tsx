import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import React, {useState} from "react";
import MappingUpload from "@/app/mapping/components/MappingUpload/MappingUpload";
import {Mapping, MappingPlugin} from "@/lib/mapping/definitions";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {ShieldCheck} from "lucide-react";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Collapsible, CollapsibleContent, CollapsibleTrigger} from "@radix-ui/react-collapsible";
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {cn} from "@/lib/utils";

interface AddTagDialogProps {
    openModal: boolean;
    mappings: Mapping[];
    actionCallback: Function;
}

export function AddMappingJobDialog({openModal, mappings, actionCallback}: AddTagDialogProps) {
/*
 <MappingUpload id={mapping.mappingId}
                                   fileTypes={fileTypes}
                                   mappingCallback={mappingResultReceived}
                                   uploadCompleteCallback={mappingUploadComplete}/>
 */
    const [mappingDescription, setMappingDescription] = useState<string|undefined>(undefined);
    const [mappingPlugin, setMappingPlugin] = useState<MappingPlugin|undefined>(undefined);

    function updateValue(selection:string){
        console.log("CHANGE ", selection);
        const selectedMapping:Mapping|undefined = mappings.find((mapping:Mapping) => mapping.mappingId === selection);
        if(selectedMapping){
            setMappingDescription(selectedMapping.description);
            setMappingPlugin(selectedMapping.plugin);
        }
    }

    return (
        <Dialog open={openModal} modal={true} onOpenChange={() => actionCallback(false)}>
            <DialogContent className="bg-secondary">
                <DialogHeader>
                    <DialogTitle>Schedule Mapping Jobs(s)</DialogTitle>
                    <DialogDescription className="secondary">
                        Please select one or more files and upload them to schedule mapping jobs.
                    </DialogDescription>
                    <div className={"mt-4 mb-4"}>
                    <Select onValueChange={updateValue}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Please select a Mapping"/>
                        </SelectTrigger>
                        <SelectContent>
                            {mappings.map((mapping: Mapping) => {
                                return (<SelectItem key={mapping.mappingId} value={mapping.mappingId}>{mapping.title}</SelectItem>)
                            })}
                        </SelectContent>
                    </Select>
                    </div>
                    {mappingDescription ?
                        (
                            <Collapsible>
                                <CollapsibleTrigger>Show Mapping Description</CollapsibleTrigger>
                                <CollapsibleContent>
                                    <Card className={cn("w-full")}>
                                        <CardHeader>
                                            <CardTitle>Mapping Title</CardTitle>
                                            <CardDescription>Mapping description.</CardDescription>
                                        </CardHeader>
                                        <CardContent className="grid gap-4">
                                           <div>
                                                {
                                                    <div
                                                        className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                                                    >
                                                        <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                                                        <div className="space-y-1">
                                                            <p className="text-sm font-medium leading-none">
                                                                {mappingPlugin?.name}
                                                            </p>
                                                            <p className="text-sm text-muted-foreground">
                                                                {mappingDescription}
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


                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}
