import {ShieldCheck} from "lucide-react";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Badge} from "@/components/ui/badge";
import {Icon} from "@iconify-icon/react";
import React from "react";

export function CreateHelp() {
    return (
        <Alert>
            <ShieldCheck className="h-4 w-4"/>
            <AlertTitle>Access Permissions</AlertTitle>
            <AlertDescription>
                                <span>Here you can register new metadata document. The creation process comprises two parts:
                                    <br/><br/>
                                    <ul className={"list-disc"}>
                                        <li>Creation of administrative metadata to describe the metadata document.</li>
                                        <li>Providing the actual metadata document.</li>
                                    </ul>
                                    <br/>
                                    The first part is carried out on the left hand side. To allow to register a new metadata document, at least
                                    a title and a related resource of type IS_METADATA_FOR has to be provided. Additional metadata can be added later. After entering
                                    a title and completing the IS_METADATA_FOR entry by adding a value, the metadata has to be added to the list of file uploads.
                                    As soon as all mandatory metadata is provided, the transfer button&nbsp;
                                    <Badge variant="contextual_disabled">
                                                <Icon fontSize={16}
                                                      icon={"ic:outline-double-arrow"}
                                                      className="h-4 w-4"/></Badge> will change to  <Badge
                                        variant="contextual">
                                                <Icon fontSize={16}
                                                      icon={"ic:outline-double-arrow"}
                                                      className="h-4 w-4"/></Badge> and can be used to transfer the metadata document the the upload element on the right
                                    hand side and will appear as <i>record.json</i>. <br/>
                                    Now, the actual metadata document must be provided. Therefor, click <span
                                        className={"text-sky-400"}>+ Add more</span> in the upper right corner of the upload element
                                    and select a document. Depending on the previously selected metadata schema, either JSON or XML documents should be uploaded.
                                    The selected file will be additionally shown in the file upload area.<br/>
                                    As soon as two elements are selected, click <Badge variant="thumb_set"
                                                                                       className={"text-ring p-1"}>Upload 2 files</Badge> to start the upload.
                                    As soon as the upload and registration process is finished, you will be redirected to the metadata document editor,
                                    where additional access permissions can be assigned.
                                     <br/><br/>
                                    <span className={"text-warn "}>If the transfer button gets not activated, you may have to leave the active form input field by clicking to the page background to trigger
                                    the input validation. If you want to change the administrative metadata after adding it to the upload component, you may remove it from there in order to add it again.
</span>

</span>
            </AlertDescription>
        </Alert>
    );
}
