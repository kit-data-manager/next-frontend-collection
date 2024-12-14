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
import {Mapping} from "@/lib/mapping/definitions";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {ShieldCheck} from "lucide-react";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";

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

    function updateValue(selection:string){
        console.log("CHANGE ", selection);
        const selectedMapping:Mapping|undefined = mappings.find((mapping:Mapping) => mapping.mappingId === selection);
        if(selectedMapping){
            setMappingDescription(selectedMapping.description);
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
                            <Alert>
                                <ShieldCheck className="h-4 w-4"/>
                                <AlertTitle>Access Permissions</AlertTitle>
                                <AlertDescription>
                                </AlertDescription>
                            </Alert>
                        )

                        : undefined}


                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}
