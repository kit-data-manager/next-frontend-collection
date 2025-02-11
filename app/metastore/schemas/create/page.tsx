"use client";

import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import React, {useEffect, useState} from "react";
import {ToastContainer} from "react-toastify";
import SectionCaption from "@/components/SectionCaption/SectionCaption";
import {fetchSchema} from "@/lib/base-repo/client-data";
import SchemaRecordFileUploader from "@/app/metastore/components/SchemaRecordFileUploader/SchemaRecordFileUploader";
import {useRouter} from "next/navigation";
import {Icon} from "@iconify/react";
import useUserPrefs from "@/lib/hooks/useUserPrefs";
import {useSession} from "next-auth/react";
import {CreateHelp} from "@/app/metastore/schemas/create/CreateHelp";

export default function Page() {
    const [schema, setSchema] = useState(undefined);
    const router = useRouter();
    const {data, status} = useSession();

    const {userPrefs, updateUserPrefs} = useUserPrefs(data?.user.id);

    useEffect(() => {
        fetchSchema(`/definitions/base-repo/models/createSchemaModel.json`).then(schema => setSchema(schema));
    }, []);

    function reload(target:string){
        router.push(target);
    }

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    {label: 'Overview', href: '/metastore'},
                    {label: 'Schemas', href: '/metastore/schemas'},
                    {
                        label: `Create Schema`,
                        href: `/metastore/schemas/create`,
                        active: true,
                    },
                ]}
            />
            <SectionCaption caption={"Create Schema"}/>
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
                            <SchemaRecordFileUploader reloadCallback={(target: string) => reload(target)}
                                                      schema={schema}/>
                        </div>
                    </div>
                </div>
                <ToastContainer/>

        </main>
);
}
