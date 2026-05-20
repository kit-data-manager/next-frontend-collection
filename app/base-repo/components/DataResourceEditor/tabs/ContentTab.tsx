import {ContentInformation, DataResource} from "@/lib/definitions";
import {userCanDelete, userCanDownload} from "@/lib/event-utils";
import ContentInformationCard from "@/app/base-repo/components/ContentInformationCard/ContentInformationCard";
import {TabsContent} from "@/components/ui/tabs";
import React from "react";
import {UserPrefsType} from "@/lib/hooks/useUserPrefs";
import {Session} from "next-auth";
import {
    ContentTabHelp,
    ContentTabHelpNoContent
} from "@/app/base-repo/components/DataResourceEditor/help/ContentTabHelp";
import {ActionEvent, DataCardCustomEvent} from "@kit-data-manager/data-view-web-component";

interface ContentTabProps {
    resource: DataResource;
    content: ContentInformation[];
    userPrefs: UserPrefsType;
    session: Session | null;
    cardCallbackAction: (action: DataCardCustomEvent<ActionEvent>, resource: ContentInformation) => void;
}

export function ContentTab({resource, content, userPrefs, session, cardCallbackAction}:ContentTabProps) {
    return (
        <TabsContent value="content">
            {content && content.length > 0 ?
                <>
                    {userPrefs.helpVisible ?
                        <ContentTabHelp/>
                        : undefined}
                    <div className="rounded-lg p-2 mt-2 md:pt-0">
                        {content.map((element: ContentInformation, i: number) => {

                            return (
                                <ContentInformationCard
                                    key={i}
                                    content={element}
                                    enableDownload={userCanDownload(resource, session?.user)}
                                    enableDelete={userCanDelete(resource, session?.user)}
                                    cardCallbackAction={(ev) => cardCallbackAction(ev, element)}></ContentInformationCard>
                            )
                        })}
                    </div>
                </>
                :
                <ContentTabHelpNoContent/>
            }
        </TabsContent>
    );
}
