'use client'

import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import {formatDateToLocal} from "@/app/lib/utils";
import {DataCard} from "data-card-react";

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    /*const [invoice, customers] = await Promise.all([
        fetchInvoiceById(id),
        fetchCustomers(),
    ]);
    if (!invoice) {
        notFound();
    }*/
    const resource = {
        "id": "123445",
        "name": "Test",
        "date": "2024-12-12"
    };//await fetchFilteredInvoices(query, currentPage);

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
                data-title={resource.name}
                sub-title={"SubTest"}
                variant="default"
                image-url={"https://via.placeholder.com/100?text=placeholder"}
                body-text={"This is the description"}
                textRight={{'label':'Test', 'value':formatDateToLocal(resource.date)}}
                children-data={undefined}
                tags={[{"label":"Test", "value":"val"}]}
                actionButtons={[{"label":"edit", "urlTarget":"_self", "url": `/dashboard/dataresources/${resource.id}/edit`}]}
            ></DataCard>
                        </div>
                    </div>
                </div>
            </div>

        </main>
    );
}
