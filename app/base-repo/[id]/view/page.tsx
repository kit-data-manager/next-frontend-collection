'use client'

import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import {formatDateToLocal} from "@/app/lib/utils";
import {DataCard} from "data-card-react";
import {fetchDataResource} from "@/app/lib/base-repo/data";
import useSWR from "swr";
import {
    getChildren,
    getDescription,
    getSubtitle,
    getTags,
    getThumb,
    getTitle
} from "@/app/lib/base-repo/datacard-utils";

export default function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    /*const [invoice, customers] = await Promise.all([
        fetchInvoiceById(id),
        fetchCustomers(),
    ]);
    if (!invoice) {
        notFound();
    }*/

    const fetcher = (url:string) => fetch(url).then(function(response){
        return response.json();
    });

    const fetcher2 = (url:string) =>  fetch(url,
        {headers: {"Accept": "application/vnd.datamanager.content-information+json"}}).then(res => res.json());

    const { data: resource,isLoading:resourceLoading, isError: resourceError  } = useSWR("http://localhost:8081/api/v1/dataresources/" + id, fetcher);
    const { data: content ,isLoading:contentLoading, isError: contentError} = useSWR(
        resource ?
        "http://localhost:8081/api/v1/dataresources/" + resource.id + "/data/" :
        null, fetcher2);

    if (resourceError || contentError) {
        return <p>Failed to fetch</p>;
    }

    if (resourceLoading || contentLoading) {
        return <p>Loading resources...</p>;
    }

    if (!resource || !content) {
        return <p>Failed to load resources.</p>;
    }

    resource["children"] = content;

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'DataResources', href: '/dashboard/dataresources' },
                    {
                        label: 'View DataResource',
                        href: `/dashboard/dataresources/${id}/view`,
                        active: true,
                    },
                ]}
            />
            <div className="mt-6 flow-root">
                <div className="block min-w-full align-middle">
                    <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
                        <div>
                            <DataCard
                            data-title={getTitle(resource)}
                            sub-title={getSubtitle(resource)}
                            variant="detailed"
                            children-variant="default"
                            image-url={getThumb(resource)}
                            body-text={getDescription(resource)}
                            textRight={{'label': resource.publisher, 'value': resource.publicationYear}}
                            children-data={getChildren(resource)}
                            tags={getTags(resource)}
                            actionButtons={[{
                            "label": "View",
                            "urlTarget": "_self",
                            "iconName": "material-symbols-light:edit-square-outline",
                            "eventIdentifier": "viewResource_" + resource.id,
                        },{
                            "label": "Edit",
                            "urlTarget": "_self",
                            "iconName": "material-symbols-light:edit-square-outline",
                            "eventIdentifier": "editResource_" + resource.id,
                        },
                            {
                                "label": "Download",
                                "iconName": "material-symbols-light:download",
                                "urlTarget": "_blank",
                                "eventIdentifier": "downloadResource_" + resource.id,
                            }]}
                            ></DataCard>
                        </div>
                    </div>
                </div>
            </div>

        </main>
    );
}
