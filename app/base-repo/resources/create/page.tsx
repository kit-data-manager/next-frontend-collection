import Breadcrumbs from '@/components/Breadcrumbs/breadcrumbs';
import DataResourceEditor from '@/components/dataresources/data-resource-editor'
import {fetchDataResource, fetchDataResourceEtag, loadContent, loadSchema} from "@/lib/base-repo/data";
import React from "react";
import {notFound} from "next/navigation";
import {ToastContainer} from "react-toastify";

export default async function Page() {
    const [ schema] = await Promise.all([
        loadSchema("public/definitions/base-repo/models/resourceModel.json")]);

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
            <div className="mt-6 flow-root">
                <div className="block min-w-full align-middle">
                    <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
                        <DataResourceEditor schema={schema} createMode={true}/>
                    </div>
                </div>
            </div>
            <ToastContainer/>

        </main>
    );
}
