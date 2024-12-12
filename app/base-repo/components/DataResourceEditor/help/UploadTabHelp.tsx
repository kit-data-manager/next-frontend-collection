import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Upload} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import React from "react";

export function UploadTabHelp() {
    return (
        <Alert>
            <Upload className="h-4 w-4"/>
            <AlertTitle>Upload Content</AlertTitle>
            <AlertDescription>
                                <span>Here you can upload new files to your resource. This is possible if you have WRITE
                                    permissions and
                                    as long as the resource is in state VOLATILE. For uploading, just drag&drop files
                                    from your local
                                    filesystem to the upload area below or click <Badge className={"text-info"}
                                                                                        variant="outline">browse files</Badge> and select one
                                    or more files for upload.
                                    To start the upload. press the upload button.</span>
                <br/><br/>
                <span className={"text-warn"}> Be aware that you may upload a maximum of 10 files at once and that no two files with
                                the same name can be uploaded to a resource.</span>
            </AlertDescription>
        </Alert>
    );
}
