'use client';

import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import React, {useEffect, useState} from "react";
import {userCanDownload, userCanEdit} from "@/lib/event-utils";
import SectionCaption from "@/components/SectionCaption/SectionCaption";
import {DataResource, Permission, State} from "@/lib/definitions";
import {useSession} from "next-auth/react";
import ErrorPage from "@/components/ErrorPage/ErrorPage";
import {Errors} from "@/components/ErrorPage/ErrorPage.d";
import Loader from "@/components/general/Loader";
import {permissionToNumber, resourcePermissionForUser} from "@/lib/general/permission-utils";
import {ToastContainer} from "react-toastify";
import {useRouter} from "next/navigation";
import {Editor, useMonaco} from "@monaco-editor/react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Upload} from "lucide-react";
import {Icon} from "@iconify-icon/react";
import {useTheme} from "next-themes";
import {runAction} from "@/lib/actions/action-executor";
import {useDebouncedCallback} from "use-debounce";
import {ActionButtonInterface} from "@/app/base-repo/components/DataResourceCard/DataResourceCard.d";
import {fetchMetadataDocument, fetchMetadataEtag, fetchMetadataRecord} from "@/lib/metastore/client-data";
import {DownloadMetadataDocumentAction} from "@/lib/actions/metastore/downloadMetadataDocumentAction";
import {EditMetadataDocumentAction} from "@/lib/actions/metastore/editMetadataDocumentAction";
import MetadataDocumentCard from "@/app/metastore/components/MetadataDocumentCard/MetadataDocumentCard";

export default function Page({params}) {
    const used = React.use(params) as { id: string };
    const id = used.id;

    const [resource, setResource] = useState({} as DataResource);
    const [etag, setEtag] = useState({} as string);
    const [isLoading, setLoading] = useState(true)
    const [editorValue, setEditorValue] = useState("")

    const {data, status} = useSession();
    const actionEvents: ActionButtonInterface[] = [];
    const router = useRouter();
    const monaco = useMonaco();
    const theme = useTheme();

    const handleAction = useDebouncedCallback((event, resource: DataResource) => {
        const eventIdentifier: string = event.detail.eventIdentifier;
        runAction(eventIdentifier, data?.accessToken, (redirect: string) => {
            router.push(redirect);
        });
    });

    useEffect(() => {
        // do conditional chaining
        monaco?.languages.typescript.javascriptDefaults.setEagerModelSync(true);
        // or make sure that it exists by other ways
        monaco?.editor.addKeybindingRules([
            {
                // Reindent lines with Ctrl + Shift + F
                keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF,
                command: "editor.action.formatDocument",
            },
        ]);
    }, [monaco]);

    useEffect(() => {
        setLoading(true);
        fetchMetadataRecord("document", id, data?.accessToken).then(async (res) => {
            await fetchMetadataEtag("document", res.id, data?.accessToken).then(result => setEtag(result as string)).catch(error => {
                console.error(`Failed to obtain etag for metadata document ${id}`, error)
            });
            return res;
        }).then((res) => {
            const accept = res.resourceType.value === "JSON_Metadata"?"application/json":"application/xml";
            fetchMetadataDocument("document", res.id, accept, data?.accessToken).then(res => {
                setEditorValue(res);
            })
            setResource(res);
        }).then(() => {
            setLoading(false);
        }).catch(error => {
            console.log(`Failed to fetch metadata document ${id}`, error)
            setLoading(false);
        })
    }, [id, data?.accessToken]);

    if (!id) {
        return ErrorPage({errorCode: Errors.NotFound, backRef: "/metastore/metadata"})
    }

    if (status === "loading" || isLoading) {
        return <Loader/>;
    }

    if (!resource || !resource.id) {
        return ErrorPage({errorCode: Errors.NotFound, backRef: "/metastore/metadata"})
    }

    let permission: 0 | 1 | 2 | 3 = resourcePermissionForUser(resource, data?.user.preferred_username, data?.user.groups);
    if (permission < permissionToNumber(Permission.READ)) {
        return ErrorPage({errorCode: Errors.Forbidden, backRef: "/metastore/metadata"})
    }
    //actionEvents.push(new CreateMetadataAction(resource.id, resource.resourceType.value === "JSON_Metadata" ? "json" : "xml", resource.version).getDataCardAction());
    if (userCanEdit(resource, data?.user.preferred_username, data?.user.groups)) {
        actionEvents.push(new EditMetadataDocumentAction(resource.id).getDataCardAction());
    }

    /*if (userCanDelete(resource, data?.user.preferred_username, data?.user.groups)) {
        if (resource.state === State.REVOKED) {
            actionEvents.push(new DeleteMetadataDocumentAction(resource.id, etag).getDataCardAction());
        } else {
            actionEvents.push(new RevokeMetadataDocumentAction(resource.id, etag).getDataCardAction());
        }
    }*/

    if (userCanDownload(resource, data?.user.preferred_username, data?.user.groups)) {
        actionEvents.push(new DownloadMetadataDocumentAction(resource.id, "document", resource.resourceType.value === "JSON_Metadata" ? "json" : "xml").getDataCardAction());
    }

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    {label: 'Overview', href: '/metastore'},
                    {label: 'Metadata Documents', href: '/metastore/metadata'},
                    {
                        label: `View Metadata Document`,
                        href: `/metastore/metadata/${id}/view`,
                        active: true,
                    },
                ]}
            />
            <SectionCaption caption={"View Metadata Document"}/>

            <div className="grid flex-grow-1">
                <Tabs defaultValue={"metadata"} className="w-full">
                    <TabsList>
                        <TabsTrigger value="metadata"><Upload className="h-4 w-4 mr-2"/> Metadata</TabsTrigger>
                        <TabsTrigger value="document"><Icon fontSize={16} icon={"mdi:file-edit-outline"}
                                                          className="h-4 w-4 mr-2"/>Document</TabsTrigger>
                    </TabsList>
                    <TabsContent value="metadata">
                        <MetadataDocumentCard metadataRecord={resource}
                                    detailed={true}
                                    actionEvents={actionEvents}
                                    cardCallbackAction={(ev) => handleAction(ev, resource)}></MetadataDocumentCard>
                    </TabsContent>
                    <TabsContent value="document">
                        <div className="mt-4 max-w-[75%]">
                            <Editor height="90vh"
                                    defaultLanguage={resource.resourceType.value === "JSON_Metadata" ? "json" : "xml"}
                                    value={editorValue}
                                    theme={theme.theme === "light" ? "vs" : theme.theme === "dark" ? "vs-dark" : "hc-black"}
                                    options={{
                                        readOnly: false,
                                        minimap: {enabled: false},
                                        contextmenu: true,
                                        autoIndent: "advanced",
                                        detectIndentation: true,
                                        formatOnType: true,
                                        formatOnPaste: true,
                                    }}/>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
            <ToastContainer/>

        </main>
    );
}
