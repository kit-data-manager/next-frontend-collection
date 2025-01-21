'use client';

import React, {useEffect, useState} from "react";

import {useRouter} from "next/navigation";
import {DataResource, Permission} from "@/lib/definitions";
import {useSession} from "next-auth/react";
import Loader from "@/components/general/Loader";
import ErrorPage from "@/components/ErrorPage/ErrorPage";
import {Errors} from "@/components/ErrorPage/ErrorPage.d";
import {permissionToNumber, resourcePermissionForUser} from "@/lib/permission-utils";
import {Tabs} from "@/components/ui/tabs";
import {Icon} from "@iconify/react";
import useUserPrefs from "@/lib/hooks/userUserPrefs";
import {TabsHeader} from "@/app/metastore/components/SchemaEditor/tabs/TabsHeader";
import {MetadataTab} from "@/app/metastore/components/SchemaEditor/tabs/MetadataTab";
import {AccessTab} from "@/app/metastore/components/SchemaEditor/tabs/AccessTab";
import {fetchMetadataSchema} from "@/lib/metastore/client_data";

export default function SchemaEditor({...props}) {
    //general props
    const target = props.target ? props.target : "metadata";
    const id = props.id;
    const createMode = props.createMode;
    const router = useRouter();

    //loading props
    const [isLoading, setIsLoading] = useState(true);
    const [mustReload, setMustReload] = useState(false);

    //content-specific props
    const [resource, setResource] = useState({} as DataResource);
    const [etag, setEtag] = useState('' as string);

    //auth and prefs
    const {data, status} = useSession();
    const {userPrefs, updateUserPrefs} = useUserPrefs(data?.user.id);

    //fetch schema
    useEffect(() => {
        if (createMode) {
            setIsLoading(false);
        } else {
            setIsLoading(true);
            fetchMetadataSchema(id, data?.accessToken).then((res) => {
                if (res.etag) {
                    setEtag(res.etag);
                }
                return res;
            }).then((res) => {
                setResource(res);
                setIsLoading(false);
            }).catch(error => {
                console.log(`Failed to fetch schema ${id}`, error)
                setIsLoading(false);
            })
        }
        setMustReload(false);
    }, [id, data?.accessToken, status, etag, createMode, mustReload]);

    if (status === "loading" || isLoading) {
        return (<Loader/>)
    }

    if (!isLoading) {
        if (!createMode) {
            if (!resource || !resource.id) {
                return ErrorPage({errorCode: Errors.NotFound, backRef: "/metastore/schemas"})
            }

            let permission: 0|1|2|3 = resourcePermissionForUser(resource, data?.user.id, data?.user.groups);

            if (permission < permissionToNumber(Permission.WRITE)) {
                return ErrorPage({errorCode: Errors.Forbidden, backRef: "/metastore/schemas"})
            }
        }
    }

    function reload(target:string){
        router.push(target);
        setMustReload(true);
    }

    return (
        <div className="flex col-2">
            <div className="grid flex-grow justify-items-stretch">
                <button onClick={() => updateUserPrefs({helpVisible: !userPrefs.helpVisible})}
                        title={"Show/Hide Help"}
                        className={"justify-self-end"}>
                    <Icon
                        fontSize={24}
                        icon={"material-symbols-light:help-outline"}
                        className={"h-8 w-8 mr-2"}
                        style={userPrefs.helpVisible ? {color: "#0F0"} : {color: "#F00"}}
                    />
                </button>
                <Tabs defaultValue={createMode ? "metadata" : target} className="w-full">
                    <TabsHeader createMode={createMode}/>
                    <MetadataTab createMode={createMode}
                                 resource={resource}
                                 etag={etag}
                                 schema={props.schema}
                                 userPrefs={userPrefs}
                                 updateResourceCallback={setResource}
                                 reloadCallback={reload}/>
                    <AccessTab resource={resource}
                               etag={etag}
                               userPrefs={userPrefs}
                               reloadCallback={reload}/>
                </Tabs>

            </div>
        </div>
    )
}
