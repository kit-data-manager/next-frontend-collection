import ContentUpload from "@/app/base-repo/components/ContentUpload/ContentUpload";
import {TabsContent} from "@/components/ui/tabs";
import React from "react";
import {UserPrefsType} from "@/lib/hooks/userUserPrefs";
import {UploadTabHelp} from "@/app/base-repo/components/DataResourceEditor/help/UploadTabHelp";

interface UploadTabProps {
    resourceId: string;
    userPrefs: UserPrefsType;
    reloadCallback:Function;
}

export function UploadTab({resourceId, userPrefs, reloadCallback}: UploadTabProps) {
    return (
        <TabsContent value="upload">
            {userPrefs.helpVisible ?
                <UploadTabHelp/>
                : undefined}
            <ContentUpload id={resourceId} reloadCallback={reloadCallback}></ContentUpload>
        </TabsContent>
    );
}
