'use client';

import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import React, {useEffect, useState} from "react";
import {userCanDelete, userCanDownload, userCanEdit} from "@/lib/event-utils";
import SectionCaption from "@/components/SectionCaption/SectionCaption";
import {DataResource, Permission, State} from "@/lib/definitions";
import {useSession} from "next-auth/react";
import ErrorPage from "@/components/ErrorPage/ErrorPage";
import {Errors} from "@/components/ErrorPage/ErrorPage.d";
import Loader from "@/components/general/Loader";
import {permissionToNumber, resourcePermissionForUser} from "@/lib/general/permission-utils";
import {ToastContainer} from "react-toastify";
import SchemaCard from "@/app/metastore/components/SchemaCard/SchemaCard";
import {useRouter} from "next/navigation";
import {EditSchemaAction} from "@/lib/actions/metastore/editSchemaAction";
import {DownloadSchemaAction} from "@/lib/actions/metastore/downloadSchemaAction";
import {Editor, useMonaco} from "@monaco-editor/react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Upload} from "lucide-react";
import {Icon} from "@iconify-icon/react";
import {useTheme} from "next-themes";
import {runAction} from "@/lib/actions/action-executor";
import {useDebouncedCallback} from "use-debounce";
import {ActionButtonInterface} from "@/app/base-repo/components/DataResourceCard/DataResourceCard.d";
import {RevokeSchemaAction} from "@/lib/actions/metastore/revokeSchemaAction";
import {DeleteSchemaAction} from "@/lib/actions/metastore/deleteSchemaAction";
import {CreateMetadataAction} from "@/lib/actions/metastore/createMetadataAction";
import {fetchMetadataDocument, fetchMetadataEtag, fetchMetadataRecord} from "@/lib/metastore/client-data";

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
        // monaco?.languages.typescript.javascriptDefaults.setEagerModelSync(true);
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
        fetchMetadataRecord("schema", id, data?.accessToken).then(async (res) => {
            await fetchMetadataEtag("schema", res.id, data?.accessToken).then(result => setEtag(result as string)).catch(error => {
                console.error(`Failed to obtain etag for schema ${id}`, error)
            });
            return res;
        }).then((res) => {
            const accept = res.resourceType.value === "JSON_Schema"?"application/json":"application/xml";
            fetchMetadataDocument("schema", res.id, accept, data?.accessToken).then(res => {
                setEditorValue(res);
            })
            setResource(res);
        }).then(() => {
            setLoading(false);
        }).catch(error => {
            console.log(`Failed to fetch schema ${id}`, error)
            setLoading(false);
        })
    }, [id, data?.accessToken]);

    if (!id) {
        return ErrorPage({errorCode: Errors.NotFound, backRef: "/metastore/schemas"})
    }

    if (status === "loading" || isLoading) {
        return <Loader/>;
    }

    if (!resource || !resource.id) {
        return ErrorPage({errorCode: Errors.NotFound, backRef: "/metastore/schemas"})
    }

    let permission: 0 | 1 | 2 | 3 = resourcePermissionForUser(resource, data?.user.preferred_username, data?.user.groups);
    if (permission < permissionToNumber(Permission.READ)) {
        return ErrorPage({errorCode: Errors.Forbidden, backRef: "/metastore/schemas"})
    }
    actionEvents.push(new CreateMetadataAction(resource.id, resource.resourceType.value === "JSON_Schema" ? "json" : "xml", resource.version).getDataCardAction());
    if (userCanEdit(resource, data?.user.preferred_username, data?.user.groups)) {
        actionEvents.push(new EditSchemaAction(resource.id).getDataCardAction());
    }

    if (userCanDelete(resource, data?.user.preferred_username, data?.user.groups)) {
        if (resource.state === State.REVOKED) {
            actionEvents.push(new DeleteSchemaAction(resource.id, etag).getDataCardAction());
        } else {
            actionEvents.push(new RevokeSchemaAction(resource.id, etag).getDataCardAction());
        }
    }

    if (userCanDownload(resource, data?.user.preferred_username, data?.user.groups)) {
        actionEvents.push(new DownloadSchemaAction(resource.id, "schema", resource.resourceType.value === "JSON_Schema" ? "json" : "xml").getDataCardAction());
    }

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    {label: 'Overview', href: '/metastore'},
                    {label: 'Schemas', href: '/metastore/schemas'},
                    {
                        label: `View Schema`,
                        href: `/metastore/schemas/${id}/view`,
                        active: true,
                    },
                ]}
            />
            <SectionCaption caption={"View Schema"}/>

            <div className="grid flex-grow-1">
                <Tabs defaultValue={"metadata"} className="w-full">
                    <TabsList>
                        <TabsTrigger value="metadata"><Upload className="h-4 w-4 mr-2"/> Metadata</TabsTrigger>
                        <TabsTrigger value="schema"><Icon width={"16"} height={"16"} icon={"mdi:file-edit-outline"}
                                                          className="h-4 w-4 mr-2"/>Schema</TabsTrigger>
                    </TabsList>
                    <TabsContent value="metadata">
                        <SchemaCard schemaRecord={resource}
                                    detailed={true}
                                    actionEvents={actionEvents}
                                    cardCallbackAction={(ev) => handleAction(ev, resource)}></SchemaCard>
                    </TabsContent>
                    <TabsContent value="schema">
                        <div className="mt-4 w-full">
                            <Editor height="90vh"
                                    defaultLanguage={resource.resourceType.value === "JSON_Schema" ? "json" : "xml"}
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
