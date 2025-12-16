import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Icon} from "@iconify-icon/react";
import {Badge} from "@/components/ui/badge";
import React from "react";
import {CircleSlash2, Upload} from "lucide-react";

export function ContentTabHelp() {
    return (
        <Alert>
            <div className="bg-error text-white p-2">Error Test</div>

            <Icon width={"16"}
                  height={"16"} icon={"mdi:file-edit-outline"} className="h-4 w-4 mr-2"/>
            <AlertTitle>Edit Content</AlertTitle>
            <AlertDescription>
                                <span>Here you can edit and access existing content associated with your resource. You may add a tag via the <Badge
                                    variant="info">+</Badge>
                                    button, you can  <Badge variant="outline">
                                        <Icon
                                        width={"16"}
                                        height={"16"} icon={"material-symbols-light:download"}/> Download</Badge> single files,
                                    or you can <Badge variant="outline">
                                        <Icon width={"16"} height={"16"}
                                                                              icon={"material-symbols-light:skull-outline"}/> Delete</Badge> files if you have WRITE permissions.
                                    Furthermore, you can mark a file as <Badge variant="thumb_unset">Thumb</Badge> image. A thumb is shown in the resources listing and can be assigned to all files of type jpg, gif, and png
                                    which are smaller than 160 Kb. Active thumb images are marked with <Badge
                                        variant="thumb_set">Thumb</Badge>. If multiple files are marked as thumb, only the latest assignment will count.
                                </span>
                <br/><br/>
                <span className={"text-warn "}>Be aware that removed content cannot be restored. Once a file was removed it has to be re-uploaded.</span>
            </AlertDescription>
        </Alert>
    );
}

export function ContentTabHelpNoContent() {
    return (
        <Alert>
            <CircleSlash2 className="h-4 w-4"/>
            <AlertTitle>No Content Available</AlertTitle>
            <AlertDescription>
                                <span>There was no content uploaded, yet. If you have WRITE permissions, you may switch to the <Badge
                                    variant="outline">
                                    <Upload className="h-4 w-4 mr-2"/> Upload Content</Badge> tab and initially upload files.
                                    Otherwise, you may wait until the owner of the resource has uploaded contents.
                                </span>
            </AlertDescription>
        </Alert>
    );
}
