import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Icon} from "@iconify-icon/react";
import {Badge} from "@/components/ui/badge";
import React from "react";

export function MetadataTabHelp() {
    return (
        <Alert>
            <Icon width={"16"} height={"16"} icon={"material-symbols-light:edit-square-outline"}
                  className="h-4 w-4 mr-2"/>
            <AlertTitle>Edit Metadata</AlertTitle>
            <AlertDescription>
                                <span>Here you can edit the resource&apos;s metadata. Below, you&apos;ll find a form with a pre-selection of available metadata.
                                    Mandatory elements are marked with a <span className={"text-error"}>*</span> and must be filled in order to allow to
                                    <Badge variant="thumb_set" className={"text-ring"}>Commit</Badge> changes or initially store a resource.  Information for
                                    each element can be shown by hovering over the tooltip icon <a
                                        className="tooltips">ⓘ</a>. Complex properties are collapsed
                                    and can be expanded by clicking the expand button <Badge variant="outline"><i
                                        className={"fas fa-caret-right"}></i></Badge>.
                                    There are more, optional metadata fields available, which can be made available using the
                                    <Badge variant="properties"><i className={"fas fa-list mr-2"}></i>properties</Badge> button.
                                </span>
            </AlertDescription>
        </Alert>
    );
}
