import {ShieldCheck} from "lucide-react";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Badge} from "@/components/ui/badge";
import {Icon} from "@iconify/react";
import React from "react";

export function AccessTabHelp(){
    return (
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
                                    You&apos;ll also find one special item <Badge variant="outline">
                                                <Icon fontSize={16}
                                                      icon={"fluent-mdl2:world"}
                                                      className="h-4 w-4 mr-2"/> Public Access</Badge>
                                    which includes all users as well as anonymous access. Assigning permissions to this element will open the resource to the public. Once you finished changing permissions
                                    you may <Badge variant="thumb_set" className={"text-ring"}>Commit</Badge> changes.
                                     <br/><br/>
                                        <span className={"text-warn "}>Be careful to only assign write/administrate permissions to people you trust. Pay special attention and re-check if you see a warning while updating permissions.</span>
                            </span>
            </AlertDescription>
        </Alert>
    );
}
