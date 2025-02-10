"use client";

import {fetchSchema} from "@/lib/base-repo/client-data";
import React, {useEffect, useState} from "react";
import {ToastContainer} from "react-toastify";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import SectionCaption from "@/components/SectionCaption/SectionCaption";
import {useSession} from "next-auth/react";
import {useSearchParams} from "next/navigation";
import SchemaEditor from "@/app/metastore/components/SchemaEditor/SchemaEditor";

export default function Page({params}) {
    const used = React.use(params) as {id:string};
    const id = used.id;

    const target = useSearchParams()?.get("target");

    const [schema, setSchema] = useState(undefined);
    const [uiSchema, setUiSchema] = useState(undefined);
    const {status } = useSession();

    useEffect(() => {
        if(status != "loading") {
            fetchSchema("/definitions/base-repo/models/resourceModel.json").then(schema => setSchema(schema));
        }
    }, [id, status]);

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    {label: 'Overview', href: '/metastore'},
                    {label: 'Schemas', href: '/metastore/schemas'},
                    {
                        label: `Edit Schema`,
                        href: `/metastore/schemas/${id}/edit`,
                        active: true,
                    },
                ]}
            />
            <SectionCaption caption={"Edit Schema"}/>

            <div className="flex">
                <div className="block min-w-full align-middle">
                    <div className="rounded-lg p-2 md:pt-0">
                            <SchemaEditor schema={schema} uiSchema={uiSchema} id={id} target={target}/>
                    </div>
                </div>
            </div>
            <ToastContainer/>

        </main>
    );
}
