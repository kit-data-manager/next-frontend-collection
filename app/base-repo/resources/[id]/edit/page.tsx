import Breadcrumbs from '@/components/Breadcrumbs/breadcrumbs';
import DataResourceEditor from '@/components/dataresources/data-resource-editor'
import {fetchDataResource, fetchDataResourceEtag, loadContent, loadSchema} from "@/lib/base-repo/data";
import React from "react";
import {notFound} from "next/navigation";
import {ToastContainer} from "react-toastify";

export default async function Page({params}: { params: { id: string } }) {
    const id = params.id;
    const [resource, etag, schema] = await Promise.all([
        fetchDataResource(id),
        fetchDataResourceEtag(id),
        loadSchema("public/definitions/base-repo/models/resourceModel.json")]);

    if (!resource) {
        notFound();
    }

    let contentPromise = loadContent(resource);
    const [content] = await Promise.all([contentPromise]);

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    {label: 'Overview', href: '/base-repo'},
                    {label: 'Resources', href: '/base-repo/resources'},
                    {
                        label: `Edit Resource #${id}`,
                        href: `/base-repo/resources/${id}/edit`,
                        active: true,
                    },
                ]}
            />
            <div className="mt-6 flow-root">
                <div className="block min-w-full align-middle">
                    <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
                        <DataResourceEditor schema={schema} data={resource} content={content.children} etag={etag}/>
                    </div>
                </div>
            </div>
            <ToastContainer/>

        </main>
    );
}
