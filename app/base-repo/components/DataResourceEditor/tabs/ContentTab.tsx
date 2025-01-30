import {ContentInformation, DataResource} from "@/lib/definitions";
import {ActionButtonInterface} from "@/app/base-repo/components/DataResourceCard/DataResourceCard.d";
import {userCanDelete, userCanDownload} from "@/lib/event-utils";
import {DeleteContentAction} from "@/lib/actions/base-repo/deleteContentAction";
import {DownloadContentAction} from "@/lib/actions/base-repo/downloadContentAction";
import ContentInformationCard from "@/app/base-repo/components/ContentInformationCard/ContentInformationCard";
import {TabsContent} from "@/components/ui/tabs";
import React from "react";
import {UserPrefsType} from "@/lib/hooks/userUserPrefs";
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
                            let actionEvents: ActionButtonInterface[] = [];
                            if (userCanDelete(resource, session?.user.preferred_username, session?.user.groups)) {
                                actionEvents.push(new DeleteContentAction(resource.id, element.etag ? element.etag : "<NoEtag>", element.relativePath).getDataCardAction());
                            }

                            if (userCanDownload(resource, session?.user.preferred_username, session?.user.groups)) {
                                actionEvents.push(new DownloadContentAction(resource.id, element.relativePath).getDataCardAction());
                            }

                            return (
                                <ContentInformationCard
                                    key={i}
                                    content={element}
                                    cardCallbackAction={(ev) => cardCallbackAction(ev, element)}
                                    actionEvents={actionEvents}></ContentInformationCard>
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
