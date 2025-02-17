import {ShieldCheck} from "lucide-react";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {Badge} from "@/components/ui/badge";
import {Icon} from "@iconify-icon/react";
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
                                                <Icon icon={"material-symbols-light:eye-tracking-outline"}
                                                      className="h-4 w-4 mr-2"
                                                      width={"16"}
                                                      height={"16"}/> Read:</Badge>
                                            </td>
                                            <td> Allows to see and download metadata and data of a resource.</td>
                                        </tr>
                                         <tr>
                                            <td><Badge variant="nodeco">
                                                <Icon icon={"material-symbols-light:edit-square-outline"}
                                                      className="h-4 w-4 mr-2"
                                                      width={"16"}
                                                      height={"16"}/> Write:</Badge>
                                            </td>
                                            <td> Allows all of &#39;Read&#39; plus updating metadata and data.</td>
                                        </tr>
                                         <tr>
                                            <td><Badge variant="nodeco">
                                                <Icon icon={"arcticons:vivo-i-manager"}
                                                      className="h-4 w-4 mr-2"
                                                      width={"16"}
                                                      height={"16"}/> Owner:</Badge>
                                            </td>
                                            <td> Ownership allows all of &#39;Write&#39; plus changing access permissions and deleting a resource.</td>
                                        </tr>
                                        </tbody>
                                    </table>

                                    To change permissions of a user, grab an item at its icon and drag it to the according column. The outer left column lists all available users which currently have to specific permission assigned.
                                    You&apos;ll also find one special item <Badge variant="outline">
                                                <Icon icon={"fluent-mdl2:world"}
                                                      className="h-4 w-4 mr-2"
                                                      width={"16"}
                                                      height={"16"}/> Public Access</Badge>
                                    which includes all users as well as anonymous access. Assigning permissions to this element will open the resource to the public. Once you finished changing permissions
                                    you may <Badge variant="thumb_set" className={"text-ring"}>Commit</Badge> changes.
                                     <br/><br/>
                                        <span className={"text-warn "}>Be careful to only assign write/administrate permissions to people you trust. Pay special attention and re-check if you see a warning while updating permissions.</span>
                            </span>
            </AlertDescription>
        </Alert>
    );
}
