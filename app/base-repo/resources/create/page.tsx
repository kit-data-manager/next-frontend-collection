"use client";

import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import DataResourceEditor from '@/app/base-repo/components/DataResourceEditor/DataResourceEditor'
import React, {useEffect, useState} from "react";
import {ToastContainer} from "react-toastify";
import SectionCaption from "@/components/SectionCaption/SectionCaption";
import {fetchSchema} from "@/lib/base-repo/client_data";
import Loader from "@/components/general/Loader";

export default function Page() {
    const [schema, setSchema] = useState(undefined);

    useEffect(() => {
        fetchSchema(`/definitions/base-repo/models/resourceModel.json`).then(schema => setSchema(schema));
    });

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    {label: 'Overview', href: '/base-repo'},
                    {label: 'Resources', href: '/base-repo/resources'},
                    {
                        label: `Create Resource`,
                        href: `/base-repo/resources/create`,
                        active: true,
                    },
                ]}
            />
            <SectionCaption caption={"Create Resource"}/>

            <div className="flow-root">
                <div className="block min-w-full align-middle">
                    <div className="rounded-lg p-2 md:pt-0">
                        <DataResourceEditor schema={schema} createMode={true}/>
                    </div>
                </div>
            </div>
            <ToastContainer/>

        </main>
    );
}
