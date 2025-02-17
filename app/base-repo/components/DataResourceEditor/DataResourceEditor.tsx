'use client';

import React, {useEffect, useState} from "react";

import {useRouter} from "next/navigation";
import {ContentInformation, DataResource, Permission} from "@/lib/definitions";
import {useDebouncedCallback} from "use-debounce";
import {useSession} from "next-auth/react";
import {runAction} from "@/lib/actions/action-executor";
import {fetchAllContentInformation, fetchDataResource} from "@/lib/base-repo/client-data";
import Loader from "@/components/general/Loader";
import ErrorPage from "@/components/ErrorPage/ErrorPage";
import {Errors} from "@/components/ErrorPage/ErrorPage.d";
import {permissionToNumber, resourcePermissionForUser} from "@/lib/general/permission-utils";
import {Tabs} from "@/components/ui/tabs";
import {Icon} from "@iconify-icon/react";
import useUserPrefs from "@/lib/hooks/useUserPrefs";
import {TabsHeader} from "@/app/base-repo/components/DataResourceEditor/tabs/TabsHeader";
import {UploadTab} from "@/app/base-repo/components/DataResourceEditor/tabs/UploadTab";
import {ContentTab} from "@/app/base-repo/components/DataResourceEditor/tabs/ContentTab";
import {MetadataTab} from "@/app/base-repo/components/DataResourceEditor/tabs/MetadataTab";
import {AccessTab} from "@/app/base-repo/components/DataResourceEditor/tabs/AccessTab";
import {AddTagDialog} from "@/app/base-repo/components/DataResourceEditor/dialogs/AddTagDialog";
import {AddTagAction} from "@/lib/actions/base-repo/addTagAction";

export default function DataResourceEditor({...props}) {
    //general props
    const target = props.target ? props.target : "upload";
    const id = props.id;
    const createMode = props.createMode;
    const router = useRouter();

    //loading props
    const [isLoading, setIsLoading] = useState(true);
    const [mustReload, setMustReload] = useState(false);

    //content-specific props
    const [resource, setResource] = useState({} as DataResource);
    const [etag, setEtag] = useState('' as string);
    const [content, setContent] = useState([] as Array<ContentInformation>);

    //add tag specific props
    const [openTagAddDialog, setOpenTagAddDialog] = useState<boolean>(false);
    const [contentToTag, setContentToTag] = useState<string>();
    const [contentToTagEtag, setContentToTagEtag] = useState<string>();

    //auth and prefs
    const {data, status} = useSession();
    const {userPrefs, updateUserPrefs} = useUserPrefs(data?.user.id);

    const handleContentInformationAction = useDebouncedCallback((event, content:ContentInformation) => {
        const eventIdentifier: string = event.detail.eventIdentifier;
        if (eventIdentifier.startsWith("addTag")) {
            //open addTag modal
            let parts: string[] = eventIdentifier.split("_");
            if (parts.length == 4) {
                setContentToTag(`${parts[2]}`);
                setContentToTagEtag(content.etag?content.etag:"NoEtag");
                setOpenTagAddDialog(true);
                return;
            }
        }

        runAction(eventIdentifier, data?.accessToken, (redirect: string) => {
            //reset etag for reload
            setMustReload(true);
            router.push(redirect);
        });
    });

    //fetch data resource and content information
    useEffect(() => {
        if (createMode) {
            setIsLoading(false);
        } else {
            setIsLoading(true);
            fetchDataResource(id, data?.accessToken).then((res) => {
                if (res.etag) {
                    setEtag(res.etag);
                }
                return res;
            }).then(async (res) => {
                await fetchAllContentInformation(res, data?.accessToken).then((res) => setContent(res)).catch(error => {
                    console.error(`Failed to fetch children for resource ${id}`, error)
                });
                return setResource(res);
            }).then(() => {
                setIsLoading(false);
            }).catch(error => {
                console.log(`Failed to fetch resource ${id}`, error)
                setIsLoading(false);
            })
        }
        setMustReload(false);
    }, [id, data?.accessToken, status, etag, createMode, mustReload]);

    if (status === "loading" || isLoading || !props.schema) {
        return (<Loader/>)
    }

    //const thumb: string = thumbFromContentArray(content);

    if (!isLoading) {
        if (!createMode) {
            if (!resource || !resource.id) {
                return ErrorPage({errorCode: Errors.NotFound, backRef: "/base-repo/resources"})
            }

            let permission: 0|1|2|3 = resourcePermissionForUser(resource, data?.user.preferred_username, data?.user.groups);

            if (permission < permissionToNumber(Permission.WRITE)) {
                return ErrorPage({errorCode: Errors.Forbidden, backRef: "/base-repo/resources"})
            }
        }
    }

    function addTagCallback(filename: string | undefined, etag:string, tag: string | undefined) {
        if (filename && tag) {
            runAction(new AddTagAction(id, filename, etag, tag).getActionIdentifier(), data?.accessToken, (redirect: string) => {
                //reset etag for reload
                setMustReload(true);
                setOpenTagAddDialog(false);
                router.push(redirect);
            });
            return;
        }
        setContentToTag("");
        setOpenTagAddDialog(false);
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
                        icon={"material-symbols-light:help-outline"}
                        className={"h-8 w-8 mr-2"}
                        width={"24"}
                        height={"24"}
                        style={userPrefs.helpVisible ? {color: "#0F0"} : {color: "#F00"}}
                    />
                </button>
                <Tabs defaultValue={createMode ? "metadata" : target} className="w-full">
                    <TabsHeader createMode={createMode}/>
                    <UploadTab resourceId={id}
                               userPrefs={userPrefs}
                               reloadCallback={reload}/>
                    <ContentTab resource={resource}
                                content={content}
                                userPrefs={userPrefs}
                                session={data}
                                cardCallbackAction={handleContentInformationAction}/>
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
            <AddTagDialog openModal={openTagAddDialog}
                          filename={contentToTag}
                          etag={contentToTagEtag}
                          actionCallback={addTagCallback}/>

        </div>
    )
}
