'use client';

import Image from 'next/image';
import { UpdateInvoice, DeleteInvoice } from '@/app/ui/invoices/buttons';
import { formatDateToLocal, formatCurrency } from '@/app/lib/utils';
import { fetchFilteredInvoices } from '@/app/lib/data';
import {DataCard} from "data-card-react";
import {UpdateDataResource} from "@/app/ui/dataresources/buttons";

export default async function Listing({
                                                query,
                                                currentPage,
                                            }: {
    query: string;
    currentPage: number;
}) {
    const resources = [{
        "id":1,
        "image_url": "",
        "name":"Test",
        "email":"test",
        "status":"Done",
        "date":"2024",
        "amount": 123
    }];//await fetchFilteredInvoices(query, currentPage);

    return (
        <div className="mt-6 flow-root">
            <div className="inline-block min-w-full align-middle">
                <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
                    <div>
                        {resources?.map((resource) => (
                            <DataCard
                                data-title={resource.name}
                                sub-title={"SubTest"}
                                variant="default"
                                children-variant="minimal"
                                image-url={"https://via.placeholder.com/100?text=placeholder"}
                                body-text={"This is the description"}
                                textRight={{'label':'Test', 'value':formatDateToLocal(resource.date)}}
                                children-data={undefined}
                                tags={[{"label":"Test", "value":"val"}]}
                                actionButtons={[{"label":"edit", "urlTarget":"_self", "url": `dataresources/${resource.id}/view`}]}
                            ></DataCard>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
