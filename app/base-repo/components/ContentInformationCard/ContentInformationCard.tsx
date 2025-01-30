'use client'

import {DataCard} from "@kit-data-manager/data-view-web-component-react/dist/components";
import {propertiesForContentInformation, thumbFromContentArray} from "@/lib/base-repo/datacard-utils";
import {useDebouncedCallback} from "use-debounce";
import {useRouter} from "next/compat/router";
import {ActionButtonInterface} from "@/app/base-repo/components/DataResourceCard/DataResourceCard.d";
import {ContentInformation} from "@/lib/definitions";
import {runAction} from "@/lib/actions/actionExecutor";
import {useSession} from "next-auth/react";
import {useEffect} from "react";
import {
    fetchAllContentInformation,
    fetchContentInformationEtag,
    fetchDataResourceEtag
} from "@/lib/base-repo/client_data";
import {ActionEvent, DataCardCustomEvent} from "@kit-data-manager/data-view-web-component";
import {DownloadContentAction} from "@/lib/actions/base-repo/downloadContentAction";


export interface ContentInformationCardProps {
    content: ContentInformation;
    variant?: "default" | "detailed" | "minimal" | undefined;
    childrenVariant?: "default" | "minimal";
    actionEvents?: ActionButtonInterface[];
    cardCallbackAction: (action: DataCardCustomEvent<ActionEvent>, resource: ContentInformation) => void;
}

export default function ContentInformationCard({
                                                   content,
                                                   variant,
                                                   childrenVariant,
                                                   actionEvents = [] as ActionButtonInterface[],
                                                   cardCallbackAction
                                               }: ContentInformationCardProps) {

    const {data, status} = useSession();

    useEffect(() => {
        fetchContentInformationEtag(content.parentResource.id, content.relativePath, data?.accessToken).then((etag) => {
            content.etag = etag;
        }).then(()=> {


            /*fetchAllContentInformation(resource, data?.accessToken).then(contentInformation => {
                let children: Array<DataCard> = new Array<DataCard>;

                let thumb = thumbFromContentArray(contentInformation);

                contentInformation.map(element => {
                    let actionButtons = [
                        //only add download button as we do not have access to the content etag if action called via child component
                        //content deletion will only work properly in edit resource view
                        new DownloadContentAction(resource.id, element.relativePath).getDataCardAction()
                    ];
                    children.push(propertiesForContentInformation(resource.id, element, actionButtons, true) as DataCard);
                })
                setChildrenLabel("File(s)");
                setThumb(thumb);
                setChildrenData(children);
            })*/
        });
    }, [data?.accessToken, content]);
    /*const handleAction = useDebouncedCallback((event) => {
        const eventIdentifier: string = event.detail.eventIdentifier;
        runAction(eventIdentifier, session?.accessToken, (redirect: string) => router?.push(redirect));
    });*/

   // const router = useRouter();
   /* const data: ContentInformation = props.data;
    const variant: "default" | "detailed" | "minimal" | undefined = props.variant ? props.variant : "default";
    const childVariant: "default" | "minimal" = props.childrenVariant ? props.childrenVariant : "default";
    const actionEvents = props.actionEvents ? props.actionEvents : [];
    const actionCallback = props.onActionClick ? props.onActionClick : handleAction;
*/

    let buttons: Array<ActionButtonInterface> = new Array<ActionButtonInterface>;

    /*if (userCanDelete(data.parentResource, session?.user.preferred_username, session?.user.groups)) {
        actionEvents.push(new DeleteContentAction(data.parentResource.id, element.etag ? element.etag : "<NoEtag>", element.relativePath).getDataCardAction());
    }
*/
    actionEvents.map((actionEvent: ActionButtonInterface) => {
        buttons.push(actionEvent);
    })

    let miscProperties = propertiesForContentInformation(content.parentResource.id, content, buttons, false);

    return (
        <DataCard key={content.parentResource.id}
                  variant={variant}
                  childrenVariant={childrenVariant}
                  actionButtons={actionEvents}
                  onActionClick={ev => cardCallbackAction(ev, content)} {...miscProperties}></DataCard>
    )
}

