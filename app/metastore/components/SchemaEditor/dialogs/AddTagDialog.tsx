import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {Input} from "@/components/ui/input";
import {Button} from "@/components/ui/button";
import React, {useState} from "react";

interface AddTagDialogProps {
    openModal:boolean;
    resourceId: string;
    filename:string | undefined;
    actionCallback: Function;
}

export function AddTagDialog({openModal, resourceId, filename, actionCallback}: AddTagDialogProps) {
    const [tag, setTag] = useState("");

    return (
        <Dialog open={openModal} modal={true} onOpenChange={() => actionCallback}>
            <DialogContent className="bg-secondary" onPointerDownOutside={() => {
            }} onInteractOutside={() => {
            }}>
                <DialogHeader>
                    <DialogTitle>Add New Tag</DialogTitle>
                    <DialogDescription className="secondary">
                        Provide a tag to add to this content element.
                    </DialogDescription>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Input type="text" id="tag" placeholder="newTag" className="bg-secondary border-1"
                               onChange={(event: any) => setTag(event.target.value)}/>
                    </div>
                </DialogHeader>
                <DialogFooter>
                    <Button onClick={() => actionCallback(filename, tag)}
                            className={"bg-accent text-accent-foreground"}>Add</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
