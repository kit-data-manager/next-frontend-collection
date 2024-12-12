'use client'

import {
    propertiesForContentInformation,
    propertiesForDataResource,
    thumbFromContentArray
} from "@/lib/base-repo/datacard-utils";
import {useDebouncedCallback} from "use-debounce";
import {useRouter} from "next/navigation";
import {ActionButtonInterface, ResourceCardProps} from "@/app/base-repo/components/DataResourceCard/DataResourceCard.d";
import React, {useEffect, useState} from "react";
import {runAction} from "@/lib/base-repo/actions/actionExecutor";
import {
    fetchAllContentInformation,
    fetchDataResourceEtag,
    fetchUsers,
    getAclDiff,
    patchDataResourceForQuickShare
} from "@/lib/base-repo/client_data";
import {DownloadContentAction} from "@/lib/base-repo/actions/downloadContentAction";
import {useSession} from "next-auth/react";
import {REPO_ACTIONS} from "@/lib/base-repo/actions/action";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {DataCard} from "@kit-data-manager/data-view-web-component-react/dist/components";
import {Acl, KeycloakUser} from "@/lib/definitions";
import {AutoCompleteList, ListItem} from "@/components/AutoComplete/AutoCompleteList";

export default function DataResourceCard(props: ResourceCardProps) {
    const {data, status} = useSession();
    const basePath: string = (process.env.NEXT_PUBLIC_BASE_PATH ? process.env.NEXT_PUBLIC_BASE_PATH : "");

    const [childrenData, setChildrenData] = useState([] as DataCard[]);
    const [childrenLabel, setChildrenLabel] = useState("Loading...");
    const [thumb, setThumb] = useState(`${basePath}/data.png`);
    const [openModal, setOpenModal] = useState(false);
    const [searchValue, setSearchValue] = useState<string>("");
    const [selectedValues, setSelectedValues] = useState<string[]>([]);
    const [users, setUsers] = useState<ListItem[]>([] as ListItem[]);
    const [usersLoading, setUsersLoading] = useState(false);

    const router = useRouter();
    const resource = props.data;
    const variant: "default" | "detailed" | "minimal" | undefined = props.variant ? props.variant : "default";
    const childVariant: "default" | "minimal" = props.childrenVariant ? props.childrenVariant : "default";
    const actionEvents: ActionButtonInterface[] = props.actionEvents ? props.actionEvents : [] as ActionButtonInterface[];
    let buttons: Array<ActionButtonInterface> = new Array<ActionButtonInterface>;

    const handleAction = useDebouncedCallback((event) => {
        const eventIdentifier: string = event.detail.eventIdentifier;

        if (eventIdentifier.startsWith(REPO_ACTIONS.QUICK_SHARE)) {
            runAction(eventIdentifier, doQuickShare);
        } else {
            runAction(eventIdentifier, (redirect: string) => {
                router.push(redirect);
            });
        }

    });

    const actionCallback = props.onActionClick ? props.onActionClick : handleAction;

    useEffect(() => {
        fetchAllContentInformation(resource, data?.accessToken).then(contentInformation => {
            let children: Array<DataCard> = new Array<DataCard>;

            let thumb = thumbFromContentArray(contentInformation);

            contentInformation.map(element => {
                let actionButtons = [
                    //only add download button
                    new DownloadContentAction(resource.id, element.relativePath).getDataCardAction()
                ];
                children.push(propertiesForContentInformation(resource.id, element, actionButtons, true) as DataCard);
            })
            setChildrenLabel("File(s)");
            setThumb(thumb);
            setChildrenData(children);
        });
    }, [data?.accessToken, resource.id]);

    useEffect(() => {
        setUsersLoading(true);
        fetchUsers(searchValue).then(users => {
            const newUsers: Array<ListItem> = new Array<ListItem>();
            const selection: string[] = [];

            //check/add anonymousUser aka. Open Access
            let exist: boolean = resource.acls.find((element) => element.sid === "anonymousUser") != undefined;
            newUsers.push({
                value: "anonymousUser",
                label: "Publicly Accessible",
                email: "",
                preExist: exist
            } as ListItem);
            if (exist) selection.push("anonymousUser");
            //add all other users and check for preselection
            users.map((user: KeycloakUser) => {
                exist = resource.acls.find((element) => element.sid === user.id) != undefined;
                newUsers.push({
                    value: user.id,
                    label: `${user.lastName}, ${user.firstName}`,
                    email: user.email,
                    preExist: exist
                } as ListItem);
                if (exist) selection.push(user.id);
            })

            setUsers(newUsers);
            setSelectedValues(selection);

        }).finally(() => {
            setUsersLoading(false);
        });
    }, [searchValue]);

    actionEvents.map((actionEvent: ActionButtonInterface) => {
        buttons.push(actionEvent);
    })

    function doQuickShare(redirect: string) {
        setOpenModal(true);

    }

    function closeModal() {
        setOpenModal(false);
    }

    const shareIt = () => {
        setOpenModal(false);
        const aclEntries: string[] = getAclDiff(selectedValues, resource.acls);
        fetchDataResourceEtag(resource.id, data?.accessToken).then((etag) => {
            patchDataResourceForQuickShare(resource.id, etag as string, aclEntries).finally(() => {
                setSearchValue("");
                setSelectedValues([]);
                router.push('/base-repo/resources');
            })
        });
    }

    function doSelect(values: string[]) {
        setSelectedValues(values);
    }

    let miscProperties = propertiesForDataResource(resource);
    miscProperties.childrenData = childrenData;
    miscProperties.childrenLabel = childrenLabel;
    miscProperties.imageUrl = thumb;
    return (
        <>
            <DataCard key={resource.id}
                      variant={variant}
                      childrenVariant={childVariant}
                      actionButtons={buttons}
                      onActionClick={ev => actionCallback(ev)} {...miscProperties}></DataCard>
            <Dialog open={openModal} modal={true} onOpenChange={closeModal}>
                <DialogContent className="bg-secondary" onPointerDownOutside={(e) => {
                    e.preventDefault()
                }} onInteractOutside={(e) => {
                    e.preventDefault()
                }}>
                    <DialogHeader>
                        <DialogTitle>Add New Tag</DialogTitle>
                        <DialogDescription className="secondary">
                            Provide a tag to add to this content element.
                        </DialogDescription>
                        <div className="grid w-full max-w-sm items-center gap-1.5">
                            <AutoCompleteList selectedValues={selectedValues}
                                              onSelectedValuesChange={doSelect}
                                              searchValue={searchValue}
                                              onSearchValueChange={setSearchValue}
                                              items={users ?? []}
                                              isLoading={usersLoading}
                                              emptyMessage="No user found."/>
                        </div>
                    </DialogHeader>
                    <DialogFooter>
                        <Button onClick={() => shareIt()} className={"bg-accent text-accent-foreground"}>Add</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    )
}

