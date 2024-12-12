import JsonForm from "@/components/jsonform";
import {
    DataChanged,
    DoCreateDataResource,
    DoUpdateDataResource
} from "@/app/base-repo/components/DataResourceEditor/useDataResourceEditor";
import ConfirmCancelComponent from "@/components/general/confirm-cancel-component";
import {TabsContent} from "@/components/ui/tabs";
import React, {useState} from "react";
import {DataResource} from "@/lib/definitions";
import {UserPrefsType} from "@/lib/hooks/userUserPrefs";
import {useRouter} from "next/navigation";
import {MetadataTabHelp} from "@/app/base-repo/components/DataResourceEditor/help/MetadataTabHelp";

interface MetadataTabProps {
    createMode: boolean;
    resource: DataResource;
    etag: string;
    schema: any;
    userPrefs: UserPrefsType;
    updateResourceCallback: Function;
    reloadCallback:Function;
}

export function MetadataTab({createMode, resource, etag, schema, userPrefs, updateResourceCallback, reloadCallback}: MetadataTabProps) {
    const [editorReady, setEditorReady] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const router = useRouter();

    return (
        <TabsContent value="metadata">
            {userPrefs.helpVisible ?
                <MetadataTabHelp/>
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
                                        confirmCallback={() => DoUpdateDataResource(resource, etag, reloadCallback)}
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
