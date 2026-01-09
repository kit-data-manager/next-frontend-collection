import JsonForm from "@/components/JsonForm/jsonform";
import {DataChanged} from "@/app/base-repo/components/DataResourceEditor/useDataResourceEditor";
import {DoUpdateSchema} from "@/app/metastore/components/SchemaEditor/useSchemaEditor";
import ConfirmCancelComponent from "@/components/general/confirm-cancel-component";
import {TabsContent} from "@/components/ui/tabs";
import React, {useState} from "react";
import {DataResource} from "@/lib/definitions";
import {UserPrefsType} from "@/lib/hooks/useUserPrefs";
import {useSession} from "next-auth/react";
import {MetadataTabHelp} from "@/app/metastore/components/MetadataEditor/help/MetadataTabHelp";

interface MetadataTabProps {
    resource: DataResource;
    etag: string;
    schema: any;
    userPrefs: UserPrefsType;
    updateResourceCallback: Function;
    reloadCallback: Function;
}

export function MetadataTab({
                                resource,
                                etag,
                                schema,
                                userPrefs,
                                updateResourceCallback,
                                reloadCallback
                            }: MetadataTabProps) {
    const [editorReady, setEditorReady] = useState(false);
    const [confirm, setConfirm] = useState(false);
    const {data, status} = useSession();

    return (
        <TabsContent value="metadata">
            {userPrefs.helpVisible ?
                <MetadataTabHelp/>
                : undefined}
            {editorReady ? null :
                <span>Loading editor...</span>
            }
            <JsonForm id="SchemaRecord" schema={schema} data={resource}
                      setEditorReady={setEditorReady}
                      onChange={(d: object) => DataChanged(d, setConfirm, updateResourceCallback)}/>
            <ConfirmCancelComponent confirmLabel={"Commit"}
                                    cancelLabel={"Cancel"}
                                    confirmAction={() => (confirm ? DoUpdateSchema(resource, etag, reloadCallback, data?.accessToken) : null)}
                                    cancelHref={`/metastore/schemas/`}
                                    confirm={confirm}
            />
        </TabsContent>
    );
}
