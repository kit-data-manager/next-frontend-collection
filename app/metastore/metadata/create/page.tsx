"use client";

import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import React, {useEffect, useState} from "react";
import {ToastContainer} from "react-toastify";
import SectionCaption from "@/components/SectionCaption/SectionCaption";
import {fetchSchema} from "@/lib/base-repo/client-data";
import {useRouter, useSearchParams} from "next/navigation";
import {Icon} from "@iconify/react";
import useUserPrefs from "@/lib/hooks/useUserPrefs";
import {useSession} from "next-auth/react";
import {CreateHelp} from "@/app/metastore/metadata/create/CreateHelp";
import MetadataRecordFileUploader
    from "@/app/metastore/components/MetadataRecordFileUploader/MetadataRecordFileUploader";
import {DataResource, TypeGeneral} from "@/lib/definitions";

export default function Page() {
    const searchParams = useSearchParams();

    const schemaId = searchParams?.get('schemaId')
    const schemaType = searchParams?.get('schemaType')

    const [schema, setSchema] = useState(undefined);
    const router = useRouter();
    const {data, status} = useSession();

    const {userPrefs, updateUserPrefs} = useUserPrefs(data?.user.id);

    useEffect(() => {
        fetchSchema(`/definitions/base-repo/models/createMetadataModel.json`).then(schema => setSchema(schema));
    }, []);

    function reload(target: string) {
        router.push(target);
    }

    const baseUrl: string = (process.env.NEXT_PUBLIC_METASTORE_BASE_URL ? process.env.NEXT_PUBLIC_METASTORE_BASE_URL : "");

    const metadataRecord: DataResource = {} as DataResource;
    metadataRecord.relatedIdentifiers = [{
        "identifierType": "URL",
        "value": `${baseUrl}/api/v2/schemas/${schemaId}`,
        "relationType": "HAS_METADATA"
    },
        {
            "value": null,
            "identifierType": "URL",
            "relationType": "IS_METADATA_FOR"
        }];

    if (schemaType === "json") {
        metadataRecord.resourceType = {
            value: "JSON_Metadata",
            typeGeneral: TypeGeneral.MODEL
        };
    } else if (schemaType === "xml") {
        metadataRecord.resourceType = {
            value: "XML_Metadata",
            typeGeneral: TypeGeneral.MODEL
        };
    } else {
        console.error(`Invalid schema type ${schemaType}. Only 'json' and 'xml' are supported.`)
    }

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    {label: 'Overview', href: '/metastore'},
                    {label: 'Metadata', href: '/metastore/metadata'},
                    {
                        label: `Create Metadata`,
                        href: `/metastore/metadata/create`,
                        active: true,
                    },
                ]}
            />
            <SectionCaption caption={"Create Metadata Document"}/>
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
                {userPrefs.helpVisible ?
                    <CreateHelp/>
                    : undefined}
                <div className="block min-w-full mt-4 align-middle">
                    <div className="rounded-lg p-2 md:pt-0">
                        <MetadataRecordFileUploader metadataRecord={metadataRecord}
                                                    reloadCallback={(target: string) => reload(target)}
                                                    schema={schema}/>
                    </div>
                </div>
            </div>
            <ToastContainer/>

        </main>
    );
}
