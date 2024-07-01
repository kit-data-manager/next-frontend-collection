'use client'

import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import Editor from "@/app/ui/dataresources/editor"
import useSWR from "swr";
import BuildView from "@/app/ui/dataresources/editor2";
import {useState} from "react";

export default async function Page({ params }: { params: { id: string } }) {
    const id = params.id;
    const [etag, setEtag] = useState("");

    const fetcher = (url:string) => fetch(url).then(function(response){
        console.log("Fetch")
        setEtag(response.headers.get("ETag"));
        console.log("Set ETag ", etag)
        return response.json();
    });

    const res = fetch("/base-repo/api?id=" + id);
    console.log("RESULT ", res.jsonResource);

    const { data: resource,isLoading:resourceLoading, isError: resourceError  } = useSWR("http://localhost:8081/api/v1/dataresources/" + id, fetcher);
    const { data: schema, isLoading:schemaLoading, isError: schemaError  } = useSWR("http://localhost:3000/definitions/base-repo/models/resourceModel.json", fetcher);

    if (resourceError || schemaError) {
        return <p>Failed to fetch</p>;
    }

    if (resourceLoading || schemaLoading) {
        return <p>Loading resource...</p>;
    }

    if (!resource || !schema) {
        return <p>Failed to load resource.</p>;
    }

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    { label: 'Overview', href: '/base-repo' },
                    { label: 'Resources', href: '/base-repo/resources' },
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
                        <Editor schema={schema} data={resource} etag={etag}/>
                    </div>
                </div>
            </div>
        </main>
    );
}
