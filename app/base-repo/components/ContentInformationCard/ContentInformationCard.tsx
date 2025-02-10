'use client'

import {DataCard} from "@kit-data-manager/data-view-web-component-react/dist/components";
import {propertiesForContentInformation} from "@/lib/base-repo/datacard-utils";
import {ActionButtonInterface} from "@/app/base-repo/components/DataResourceCard/DataResourceCard.d";
import {ContentInformation} from "@/lib/definitions";
import {useSession} from "next-auth/react";
import {useEffect, useState} from "react";
import {fetchContentInformationEtag} from "@/lib/base-repo/client-data";
import {ActionEvent, DataCardCustomEvent} from "@kit-data-manager/data-view-web-component";
import {DownloadContentAction} from "@/lib/actions/base-repo/downloadContentAction";
import {DeleteContentAction} from "@/lib/actions/base-repo/deleteContentAction";


export interface ContentInformationCardProps {
    content: ContentInformation;
    variant?: "default" | "detailed" | "minimal" | undefined;
    childrenVariant?: "default" | "minimal";
    enableDownload: boolean;
    enableDelete: boolean;
    cardCallbackAction: (action: DataCardCustomEvent<ActionEvent>, resource: ContentInformation) => void;
}

export default function ContentInformationCard({
                                                   content,
                                                   variant,
                                                   childrenVariant,
                                                   enableDownload,
                                                   enableDelete,
                                                   cardCallbackAction
                                               }: ContentInformationCardProps) {

    const {data: session, status} = useSession();
    const [miscProperties, setMiscProperties] = useState({} as any);

    useEffect(() => {
        fetchContentInformationEtag(content.parentResource.id, content.relativePath, session?.accessToken).then((etag) => {
            content.etag = etag;
            let buttons: Array<ActionButtonInterface> = new Array<ActionButtonInterface>;
            if (enableDelete) {
                buttons.push(new DeleteContentAction(content.parentResource.id, content.relativePath, content.etag as string).getDataCardAction());
            }
            if (enableDownload) {
                buttons.push(new DownloadContentAction(content.id, content.relativePath).getDataCardAction());
            }
            setMiscProperties(propertiesForContentInformation(content.parentResource.id, content, buttons, false));
        })
    }, [session?.accessToken, content]);

    return (
        <DataCard key={content.parentResource.id}
                  variant={variant}
                  childrenVariant={childrenVariant}
                  onActionClick={ev => cardCallbackAction(ev, content)} {...miscProperties}></DataCard>
    )
}

