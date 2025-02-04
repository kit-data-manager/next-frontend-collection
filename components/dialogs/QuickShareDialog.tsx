'use client';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog";
import {AutoCompleteList, ListItem} from "@/components/AutoComplete/AutoCompleteList";
import {Button} from "@/components/ui/button";
import React, {useEffect, useState} from "react";
import {fetchUsers} from "@/lib/base-repo/client_data";
import {DataResource, KeycloakUser} from "@/lib/definitions";

interface QuickShareDialogProps {
    openModal: boolean;
    resource: DataResource;
    closeCallback: Function;
}

export function QuickShareDialog({openModal, resource, closeCallback}: QuickShareDialogProps) {
    const [searchValue, setSearchValue] = useState<string>("");
    const [selectedValues, setSelectedValues] = useState<string[]>([]);
    const [users, setUsers] = useState<ListItem[]>([] as ListItem[]);
    const [usersLoading, setUsersLoading] = useState(false);

    /*function doSelect(values: string[]) {
        setSelectedValues(values);
    }*/

 /*  const shareIt = () => {
        closeCallback(true, selectedValues);
    }*/

    useEffect(() => {
        if (resource.acls) {
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
                    exist = resource.acls.find((element) => element.sid === user.username) != undefined;
                    newUsers.push({
                        value: user.username,
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
        }
    }, [searchValue, resource]);

    return (
        <Dialog open={openModal} modal={true} onOpenChange={() => closeCallback(false)}>
            <DialogContent className="bg-secondary" onPointerDownOutside={(e) => {
                e.preventDefault()
            }} onInteractOutside={(e) => {
                e.preventDefault()
            }}>
                <DialogHeader>
                    <DialogTitle>Quickshare</DialogTitle>
                    <DialogDescription className="secondary">
                        Select users from the list which whom you want to share the resource. Selected users will
                        receive read permissions.
                    </DialogDescription>
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <AutoCompleteList selectedValues={selectedValues}
                                          onSelectedValuesChange={(values: string[])=>  {
                                              setSelectedValues(values);
                                          }}
                                          searchValue={searchValue}
                                          onSearchValueChange={setSearchValue}
                                          items={users ?? []}
                                          isLoading={usersLoading}
                                          emptyMessage="No user found."/>
                    </div>
                </DialogHeader>
                <DialogFooter>
                    <Button onClick={() => closeCallback(true, selectedValues)} className={"bg-accent text-accent-foreground"}>Add</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
