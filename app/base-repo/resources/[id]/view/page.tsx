import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import {notFound} from "next/navigation";
import {fetchDataResource, loadContent} from "@/lib/base-repo/data";
import DataResourceCard from "@/app/base-repo/components/DataResourceCard/DataResourceCard";
import React from "react";
import {downloadEventIdentifier, editEventIdentifier} from "@/lib/event-utils";
import SectionCaption from "@/components/SectionCaption/SectionCaption";
import {DataResource} from "@/lib/definitions";

export default async function Page({params}: { params: { id: string } }) {
    const id = params.id;
    const [resource] = await Promise.all([
        fetchDataResource(id),
    ]);

    if (!resource) {
        notFound();
    }

    //load content for all resources
    const resourcesWithContent = await loadContent(resource as DataResource);
    const actionEvents = [
        editEventIdentifier(id),
        downloadEventIdentifier(id)
    ];
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    {label: 'Overview', href: '/base-repo'},
                    {label: 'Resources', href: '/base-repo/resources'},
                    {
                        label: `View Resource`,
                        href: `/base-repo/resources/${id}/view`,
                        active: true,
                    },
                ]}
            />
            <SectionCaption caption={"View Resource"}/>

            <div className="flex">
                <div className="rounded-lg grow">
                    <DataResourceCard key={resourcesWithContent.id} data={resourcesWithContent} variant={"detailed"}
                                      actionEvents={actionEvents}></DataResourceCard>
                </div>
            </div>
        </main>
    );
}
