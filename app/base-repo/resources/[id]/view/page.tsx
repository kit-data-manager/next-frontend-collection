import Breadcrumbs from '@/app/ui/general/breadcrumbs';
import {notFound} from "next/navigation";
import {fetchDataResource, fetchDataResourceEtag, loadContent, loadSchema} from "@/app/lib/base-repo/data";
import DataResourceDataCardWrapper from "@/app/ui/dataresources/data-resource-data-card-wrapper";
import React from "react";
import {downloadEventIdentifier, editEventIdentifier, viewEventIdentifier} from "@/app/lib/event-utils";

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const [resource] = await Promise.all([
        fetchDataResource(id),
    ]);

    if (!resource) {
        notFound();
    }

    //load content for all resources
    const resourcesWithContent =  await loadContent(resource);
    const actionEvents = [
        editEventIdentifier(id),
        downloadEventIdentifier(id)
    ];
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Overview', href: '/base-repo' },
                    { label: 'Resources', href: '/base-repo/resources' },
                    {
                        label: `View Resource #${id}`,
                        href: `/base-repo/resources/${id}/view`,
                        active: true,
                    },
                ]}
            />
            <div className="mt-6 flow-root">
                <div className="block min-w-full min-h-full align-middle">
                    <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
                        <div>
                            <DataResourceDataCardWrapper key={resourcesWithContent.id} data={resourcesWithContent} variant={"detailed"} actionEvents={actionEvents}></DataResourceDataCardWrapper>
                        </div>
                    </div>
                </div>
            </div>

        </main>
    );
}
