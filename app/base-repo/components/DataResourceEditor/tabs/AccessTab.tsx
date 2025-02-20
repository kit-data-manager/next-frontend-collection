import {Input} from "@/components/ui/input";
import {KanbanBoard} from "@/components/KanbanBoard/KanbanBoard";
import {
    accessControlColumns,
    DoUpdatePermissions
} from "@/app/base-repo/components/DataResourceEditor/useDataResourceEditor";
import ConfirmCancelComponent from "@/components/general/confirm-cancel-component";
import {TabsContent} from "@/components/ui/tabs";
import React, {useEffect, useState} from "react";
import {Acl, DataResource, KeycloakUser, Permission} from "@/lib/definitions";
import {UserPrefsType} from "@/lib/hooks/useUserPrefs";
import type {Element} from "@/components/KanbanBoard/BoardCard";
import capitalize from "@mui/utils/capitalize";
import {fetchUsers} from "@/lib/base-repo/client-data";
import {AccessTabHelp} from "@/app/base-repo/components/DataResourceEditor/help/AccessTabHelp";
import {useSession} from "next-auth/react";
import {
    PermissionUpdateCheckDialog
} from "@/app/base-repo/components/DataResourceEditor/dialogs/PermissionUpdateCheckDialog";

interface AccessTabProps {
    resource: DataResource;
    etag: string;
    userPrefs: UserPrefsType;
    reloadCallback: Function;
}

export function AccessTab({resource, etag, userPrefs, reloadCallback}: AccessTabProps) {
    const [elements, setElements] = useState<Element[]>([]);
    const [userFilter, setUserFilter] = useState<string>();
    const [forceReload, setForceReload] = useState<boolean>(false);
    const {data, status} = useSession();
    const [openPermissionCheck, setOpenPermissionCheck] = useState<boolean>(false);
    const [issues, setIssues] = useState<string[]>([]);

    //Fetch user list for access control
    useEffect(() => {
        fetchUsers(userFilter).then((res) => {
            //init users array with acl entries
            let userElements: Element[] = [];
            resource?.acls?.forEach((acl: Acl) => {
                let targetColumn = "users";
                switch (acl.permission) {
                    case Permission.READ:
                        targetColumn = "read";
                        break;
                    case Permission.WRITE:
                        targetColumn = "write";
                        break;
                    case Permission.ADMINISTRATE:
                        targetColumn = "administrate";
                        break;
                }

                const user: KeycloakUser | undefined = res.find((user: KeycloakUser) => user.username === acl.sid);
                if (user) {
                    //acl sid matches also KeyCloak user
                    userElements.push({
                        id: acl.sid,
                        columnId: targetColumn,
                        content: `${capitalize(user.lastName)}, ${capitalize(user.firstName)} ${data?.user.preferred_username === user.username ? "(You)" : ""}`,
                        icon: "gridicons:user-circle",
                        hidden: false,
                        anonymous: false,
                        self: data?.user.preferred_username === user.username
                    });
                } else if (acl.sid === "anonymousUser") {
                    //acl sid matches also KeyCloak user
                    userElements.push({
                        id: acl.sid,
                        columnId: targetColumn,
                        content: "Public Access",
                        icon: "fluent-mdl2:world",
                        hidden: false,
                        anonymous: true,
                        self: false
                    });
                }
            });

            //start with hiding all elements that exist in users column
            userElements.forEach((elem) => {
                if (elem.columnId === "users") {
                    elem.hidden = true;
                }
            });

            //iterate over obtained Keycloak users
            res.map((user: KeycloakUser) => {
                //check if user is already known (should be false only on first page load)
                if (!userElements.find((element) => {
                    if (element.id === user.username) {
                        //user known and not filtered out, so show if in "users" column
                        if (element.columnId === "users") {
                            //user returned by query and in "users" column, so unhide
                            // (users in other columns are not hidden, so they can be ignored)
                            element.hidden = false;
                        }
                        //return element to show successful find
                        return element;
                    }
                })) {
                    //user not found (probably, first page load)
                    userElements.push({
                        id: user.username,
                        columnId: "users",
                        content: `${capitalize(user.lastName)}, ${capitalize(user.firstName)} ${data?.user.preferred_username === user.username ? "(You)" : ""}`,
                        icon: "gridicons:user-circle",
                        hidden: false,
                        anonymous: false,
                        self: data?.user.preferred_username === user.username
                    });

                }
            });
            return userElements;
        }).then(res => {
            //check if world is already in list
            const anonymousUser: Element | undefined = res.find((element) => element.id === "anonymousUser");
            if (!anonymousUser) {
                //world not in list, so add it
                res.push({
                    id: "anonymousUser",
                    columnId: "users",
                    content: "Public Access",
                    icon: "fluent-mdl2:world",
                    hidden: false,
                    anonymous: true,
                    self: false
                });
            } else {
                //unhide anonymousUser element always
                anonymousUser.hidden = false;
            }
            setElements(res);
        });
        setForceReload(false);
    }, [userFilter, data?.accessToken, data?.user.preferred_username, resource?.acls, status, forceReload]);

    function updateUserFilter(val: string) {
        if (val && val.length > 2) {
            setUserFilter(val);
        }else{
            setUserFilter(undefined);
        }
    }

    function doReset() {
        setElements([]);
        setUserFilter(undefined);
        setForceReload(true);
    }

    if (status === "loading") {
        return (<p>Loading...</p>);
    }

    function checkPermissions() {
        const issues: string[] = [];
        const anonymousElement = elements.find((element) => element.anonymous);
        const selfElement = elements.find((element) => element.self);
        const adminCount = elements.filter((element) => element.columnId === "administrate").length;

        if (anonymousElement?.columnId === "write" || anonymousElement?.columnId === "administrate") {
            issues.push("Public Access should only include read access in order to avoid anonymous updates.");
        }

        if (selfElement?.columnId != "administrate") {
            issues.push("Revoking your ownership is not recommended as this won't allow you to update permissions anymore. ");
        }

        if (adminCount < 1) {
            issues.push("At least one owner should be assigned. Otherwise, changing permissions and revocation is only possible by instance administrators.");
        }

        if (issues.length > 0) {
            setIssues(issues);
            setOpenPermissionCheck(true);
        }else{
            doPermissionUpdate(true);
        }
    }

    function doPermissionUpdate(result: boolean) {
        setOpenPermissionCheck(false);
        if (result) {
            DoUpdatePermissions(resource, etag, elements, reloadCallback, data?.accessToken);
        }
    }

    return (
        <TabsContent value="access">
            {userPrefs.helpVisible ?
                <AccessTabHelp/>
                : undefined}
            <Input type={"text"} placeholder={"Add User List Filter"}
                   onChange={(event: any) => updateUserFilter(event.target.value)}
                   className={"mt-2"}></Input>
            <KanbanBoard elements={elements} setElements={setElements} columns={accessControlColumns}/>
            <ConfirmCancelComponent confirmLabel={"Commit"}
                                    cancelLabel={"Reset"}
                                    confirmCallback={() => {
                                        checkPermissions();
                                    }}
                                    cancelHref={() => {
                                        doReset();
                                    }}
                                    confirm={true}
            />
            <PermissionUpdateCheckDialog openModal={openPermissionCheck} issueList={issues}
                                         actionCallback={doPermissionUpdate}/>
        </TabsContent>
    );
}
