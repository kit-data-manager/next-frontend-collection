import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {ShieldCheck} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {Icon} from "@iconify/react";
import {Input} from "@/components/ui/input";
import {KanbanBoard} from "@/components/KanbanBoard/KanbanBoard";
import {
    accessControlColumns,
    DoUpdatePermissions
} from "@/app/base-repo/components/DataResourceEditor/useDataResourceEditor";
import ConfirmCancelComponent from "@/components/general/confirm-cancel-component";
import {TabsContent} from "@/components/ui/tabs";
import React, {useEffect, useState} from "react";
import {DataResource, KeycloakUser} from "@/lib/definitions";
import {UserPrefsType} from "@/lib/hooks/userUserPrefs";
import type {Element} from "@/components/KanbanBoard/BoardCard";
import capitalize from "@mui/utils/capitalize";
import {fetchUsers} from "@/lib/base-repo/client_data";
import {useRouter} from "next/navigation";

interface AccessTabProps {
    resource: DataResource;
    etag: string;
    userPrefs: UserPrefsType;
}

export function AccessTab({resource, etag, userPrefs}: AccessTabProps) {
    const [elements, setElements] = useState<Element[]>([]);
    const [userFilter, setUserFilter] = useState<string>();
    const router = useRouter();

    //Fetch user list for access control
    useEffect(() => {
        fetchUsers(userFilter).then((res) => {
            let userElements: Element[] = [...elements];

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
                    if (element.id === user.id) {
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
                        content: `${capitalize(user.lastName)}, ${capitalize(user.firstName)}`,
                        icon: "gridicons:user-circle",
                        hidden: false
                    });

                }
            });
            return userElements;
        }).then(res => {
            //check if world is already in list
            const anonymousUser: Element | undefined = res.find((element) => element.id === "world");
            if (!anonymousUser) {
                //world not in list, so add it
                res.push({
                    id: "anonymousUser",
                    columnId: "users",
                    content: "Public Access",
                    icon: "fluent-mdl2:world",
                    hidden: false
                });
            } else {
                //unhide anonymousUser element always
                anonymousUser.hidden = false;
            }
            setElements(res);
        });
    }, [userFilter]);

    function updateUserFilter(val: string) {
        if (val && val.length > 2) {
            setUserFilter(val);
        }
    }

    return (
        <TabsContent value="access">
            {userPrefs.helpVisible ?
                <Alert>
                    <ShieldCheck className="h-4 w-4"/>
                    <AlertTitle>Access Permissions</AlertTitle>
                    <AlertDescription>
                                <span>Here you can control who has which permissions while accessing this resource. There are three different permission levels, which are:
                                    <table className={"mt-4 mb-4 ml-6"}>
                                        <tbody>
                                        <tr>
                                            <td><Badge variant="nodeco">
                                                <Icon fontSize={16}
                                                      icon={"material-symbols-light:eye-tracking-outline"}
                                                      className="h-4 w-4 mr-2"/> Read:</Badge>
                                            </td>
                                            <td> You can see and download metadata and data.</td>
                                        </tr>
                                         <tr>
                                            <td><Badge variant="nodeco">
                                                <Icon fontSize={16}
                                                      icon={"material-symbols-light:edit-square-outline"}
                                                      className="h-4 w-4 mr-2"/> Write:</Badge>
                                            </td>
                                            <td> You can READ and update metadata and data.</td>
                                        </tr>
                                         <tr>
                                            <td><Badge variant="nodeco">
                                                <Icon fontSize={16}
                                                      icon={"arcticons:vivo-i-manager"}
                                                      className="h-4 w-4 mr-2"/> Administrate:</Badge>
                                            </td>
                                            <td> You can WRITE, manage access permissions and delete the resource.</td>
                                        </tr>
                                        </tbody>
                                    </table>

                                    To change permissions of a user, grab an item at its icon and drag it to the according column. The outer left column lists all available users which currently have to specific permission assigned.
                                    You&apos;ll also find one special item  <Badge variant="outline">
                                                <Icon fontSize={16}
                                                      icon={"fluent-mdl2:world"}
                                                      className="h-4 w-4 mr-2"/> Public Access</Badge> which includes all users as well as anonymous access. Assigning permissions to this element will open the resource to the public.
                                     <br/><br/>
                                        <span className={"text-warn "}>Be careful to only assign write/administrate permissions to people you trust. Pay special attention and re-check if you see a warning while updating permissions.</span>
                            </span>
                    </AlertDescription>
                </Alert>
                : undefined}
            <Input type={"text"} placeholder={"Add User List Filter"}
                   onChange={(event: any) => updateUserFilter(event.target.value)}
                   className={"mt-2"}></Input>
            <KanbanBoard elements={elements} setElements={setElements} columns={accessControlColumns}/>
            <ConfirmCancelComponent confirmLabel={"Commit"}
                                    cancelLabel={"Reset"}
                                    confirmCallback={() => DoUpdatePermissions(resource, etag, elements, router)}
                                    cancelHref={`/base-repo/resources/${resource.id}/edit`}
                                    confirm={true}
            />
        </TabsContent>
    );
}
