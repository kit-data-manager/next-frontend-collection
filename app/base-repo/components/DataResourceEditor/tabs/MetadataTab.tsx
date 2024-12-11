import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Icon} from "@iconify/react";
import {Badge} from "@/components/ui/badge";
import JsonForm from "@/components/jsonform";
import {
    DataChanged,
    DoCreateDataResource,
    DoUpdateDataResource
} from "@/app/base-repo/components/DataResourceEditor/useDataResourceEditor";
import ConfirmCancelComponent from "@/components/general/confirm-cancel-component";
import {TabsContent} from "@/components/ui/tabs";
import React, {useState} from "react";
import { DataResource} from "@/lib/definitions";
import {UserPrefsType} from "@/lib/hooks/userUserPrefs";
import {useRouter} from "next/navigation";

interface MetadataTabProps {
    createMode:boolean;
    resource: DataResource;
    etag: string;
    schema: any;
    userPrefs: UserPrefsType;
    updateResourceCallback: Function;
}

export function MetadataTab({createMode, resource, etag, schema, userPrefs, updateResourceCallback}: MetadataTabProps) {
    const [editorReady, setEditorReady] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const router = useRouter();

    return (
        <TabsContent value="metadata">
            {userPrefs.helpVisible ?
                <Alert>
                    <Icon fontSize={16} icon={"material-symbols-light:edit-square-outline"}
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
                : undefined}
            {editorReady ? null :
                <span>Loading editor...</span>
            }
            <JsonForm id="DataResource" schema={schema} data={resource}
                      setEditorReady={setEditorReady}
                      onChange={(d: object) => DataChanged(d, setConfirm, updateResourceCallback)}/>
            {!createMode ?
                <ConfirmCancelComponent confirmLabel={"Commit"}
                                        cancelLabel={"Cancel"}
                                        confirmCallback={() => DoUpdateDataResource(resource, etag, router)}
                                        cancelHref={`/base-repo/resources/${resource.id}`}
                                        confirm={confirm}
                /> :
                <ConfirmCancelComponent confirmLabel={"Create"}
                                        cancelLabel={"Cancel"}
                                        confirmCallback={() => DoCreateDataResource(resource, router)}
                                        cancelHref={`/base-repo/resources`}
                                        confirm={confirm}
                />
            }
        </TabsContent>
    );
}
