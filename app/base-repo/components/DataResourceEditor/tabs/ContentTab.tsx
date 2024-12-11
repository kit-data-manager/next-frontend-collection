import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Icon} from "@iconify/react";
import {Badge} from "@/components/ui/badge";
import {ContentInformation, DataResource} from "@/lib/definitions";
import {ActionButtonInterface} from "@/app/base-repo/components/DataResourceCard/DataResourceCard.d";
import {userCanDelete, userCanDownload} from "@/lib/event-utils";
import {DeleteContentAction} from "@/lib/base-repo/actions/deleteContentAction";
import {DownloadContentAction} from "@/lib/base-repo/actions/downloadContentAction";
import ContentInformationCard from "@/app/base-repo/components/ContentInformationCard/ContentInformationCard";
import {CircleSlash2, Upload} from "lucide-react";
import {TabsContent} from "@/components/ui/tabs";
import React from "react";
import {UserPrefsType} from "@/lib/hooks/userUserPrefs";
import {Session} from "next-auth";

interface ContentTabProps {
    resource: DataResource;
    content: ContentInformation[];
    userPrefs: UserPrefsType;
    session: Session | null;
    actionCallback: Function;
}

export function ContentTab({resource, content, userPrefs, session, actionCallback}:ContentTabProps) {
    return (
        <TabsContent value="content">
            {content && content.length > 0 ?
                <>
                    {userPrefs.helpVisible ?
                        <Alert>
                            <Icon fontSize={16} icon={"mdi:file-edit-outline"} className="h-4 w-4 mr-2"/>
                            <AlertTitle>Edit Content</AlertTitle>
                            <AlertDescription>
                                <span>Here you can edit and access existing content associated with your resource. You may add a tag via the <Badge
                                    variant="info">+</Badge>
                                    button, you can  <Badge variant="outline"><Icon
                                        fontSize={16} icon={"material-symbols-light:download"}/> Download</Badge> single files,
                                    or you can <Badge variant="outline"><Icon fontSize={16}
                                                                              icon={"material-symbols-light:skull-outline"}/> Delete</Badge> files if you have WRITE permissions.
                                    Furthermore, you can mark a file as <Badge variant="thumb_unset">Thumb</Badge> image. A thumb is shown in the resources listing and can be assigned to all files of type jpg, gif, and png
                                    which are smaller than 100 Kb. Active thumb images are marked with <Badge
                                        variant="thumb_set">Thumb</Badge>. If multiple files are marked as thumb, only the latest assignment will count.
                                </span>
                                <br/><br/>
                                <span className={"text-warn "}>Be aware that removed content cannot be restored. Once a file was removed it has to be re-uploaded.</span>
                            </AlertDescription>
                        </Alert>
                        : undefined}
                    <div className="rounded-lg p-2 mt-2 md:pt-0">
                        {content.map((element: ContentInformation, i: number) => {
                            let actionEvents: ActionButtonInterface[] = [];
                            if (userCanDelete(resource, session?.user.id, session?.user.groups)) {
                                actionEvents.push(new DeleteContentAction(resource.id, element.relativePath).getDataCardAction());
                            }

                            if (userCanDownload(resource, session?.user.id, session?.user.groups)) {
                                actionEvents.push(new DownloadContentAction(resource.id, element.relativePath).getDataCardAction());
                            }

                            return (
                                <ContentInformationCard
                                    key={i}
                                    data={element}
                                    onActionClick={(ev) => actionCallback(ev)}
                                    actionEvents={actionEvents}></ContentInformationCard>
                            )
                        })}
                    </div>
                </>
                :
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
            }
        </TabsContent>
    );
}
