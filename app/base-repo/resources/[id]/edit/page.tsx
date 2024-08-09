
import DataResourceEditor from '@/app/base-repo/components/Editor/DataResourceEditor'
import {fetchDataResource, fetchDataResourceEtag, loadContent, loadSchema} from "@/lib/base-repo/data";
import React from "react";
import {notFound} from "next/navigation";
import {ToastContainer} from "react-toastify";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import SectionCaption from "@/components/SectionCaption/SectionCaption";
import {DataResource} from "@/lib/definitions";

export default async function Page({params}: { params: { id: string } }) {
    const id = params.id;
    const [resource, etag, schema] = await Promise.all([
        fetchDataResource(id),
        fetchDataResourceEtag(id),
        loadSchema("public/definitions/base-repo/models/resourceModel.json")]);

    if (!resource) {
        notFound();
    }

    let contentPromise = loadContent(resource as DataResource);
    const [content] = await Promise.all([contentPromise]);

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    {label: 'Overview', href: '/base-repo'},
                    {label: 'Resources', href: '/base-repo/resources'},
                    {
                        label: `Edit Resource`,
                        href: `/base-repo/resources/${id}/edit`,
                        active: true,
                    },
                ]}
            />
            <SectionCaption caption={"Edit Resource"}/>

            <div className="flow-root">
                <div className="block min-w-full align-middle">
                    <div className="rounded-lg p-2 md:pt-0">
                        <DataResourceEditor schema={schema} data={resource} content={content.children} etag={etag}/>
                    </div>
                </div>
            </div>
            <ToastContainer/>

        </main>
    );
}
