import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import React from "react";

interface AddTagDialogProps {
    openModal: boolean;
    issueList: string[];
    actionCallback: Function;
}

export function PermissionUpdateCheckDialog({openModal, issueList, actionCallback}: AddTagDialogProps) {

    return (
        <Dialog open={openModal} modal={true} onOpenChange={() => actionCallback(false)}>
            <DialogContent className="bg-secondary" onPointerDownOutside={() => {
            }} onInteractOutside={() => {
            }}>
                <DialogHeader>
                    <DialogTitle>Permission Issues Found</DialogTitle>
                    <DialogDescription className="secondary">
                        There are issues with the updated permissions (see below). If you are sure they are intentional you may proceed,
                        otherwise cancel the operation and correct the issues.
                    </DialogDescription>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <ul className={"gap-1 ml-6 list-disc"}>
                            {
                                issueList.map((issue: string, index: number) => {
                                    return (<li key={`issue-${index}`}>{issue}</li>)
                                })
                            }
                        </ul>
                    </div>
                </DialogHeader>
                <DialogFooter>
                    <Button onClick={() => actionCallback(false)}
                            className={"bg-accent text-accent-foreground"}>Cancel</Button>
                    <Button onClick={() => actionCallback(true)}
                            className={"bg-destructive text-destructive-foreground"}>Proceed</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
