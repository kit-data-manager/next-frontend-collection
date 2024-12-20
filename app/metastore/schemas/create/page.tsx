"use client";

import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import DataResourceEditor from '@/app/base-repo/components/DataResourceEditor/DataResourceEditor'
import React, {useEffect, useState} from "react";
import {ToastContainer} from "react-toastify";
import SectionCaption from "@/components/SectionCaption/SectionCaption";
import {fetchSchema} from "@/lib/base-repo/client_data";
import RecordFileUploader from "@/app/metastore/components/RecordFileUploader/RecordFileUploader";

export default function Page() {
    const [schema, setSchema] = useState(undefined);

    useEffect(() => {
        fetchSchema(`/definitions/base-repo/models/createSchemaModel.json`).then(schema => setSchema(schema));
    }, []);

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

            <div className="flow-root">
                <div className="block min-w-full align-middle">
                    <div className="rounded-lg p-2 md:pt-0">
                        <RecordFileUploader reloadCallback={() => console.log("RELOAD")}
                                            updateResourceCallback={() => console.log("UPDATE")}
                                            schema={schema}
                                            createMode={true}/>
                    </div>
                </div>
            </div>
            <ToastContainer/>

        </main>
    );
}
