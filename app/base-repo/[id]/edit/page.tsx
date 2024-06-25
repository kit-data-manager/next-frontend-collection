import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import Editor from "@/app/ui/dataresources/editor"
import {fetchDataResource} from "@/app/lib/base-repo/data";

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const data = await fetch('/data.json').then(response => response.json());
    const schema = JSON.parse(data);

    /*const [invoice, customers] = await Promise.all([
        fetchInvoiceById(id),
        fetchCustomers(),
    ]);
    if (!invoice) {
        notFound();
    }*/

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'base-repo', href: '/base-repo' },
                    { label: 'Resources List', href: '/base-repo/list' },
                    {
                        label: 'Edit DataResource',
                        href: `/base-repo/${id}/edit`,
                        active: true,
                    },
                ]}
            />
            <div className="mt-6 flow-root">
                <div className="block min-w-full align-middle">
                    <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
                           <Editor schema={schema}/>
                    </div>
                </div>
            </div>
        </main>
    );
}
