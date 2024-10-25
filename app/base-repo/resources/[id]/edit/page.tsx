"use client";

import DataResourceEditor from '@/app/base-repo/components/Editor/DataResourceEditor'
import {fetchDataResource, fetchDataResourceEtag, fetchSchema, loadContent} from "@/lib/base-repo/client_data";
import React, {useEffect, useState} from "react";
import {notFound} from "next/navigation";
import {ToastContainer} from "react-toastify";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import SectionCaption from "@/components/SectionCaption/SectionCaption";
import {Permission} from "@/lib/definitions";
import {useSession} from "next-auth/react";
import {resourcePermissionForUser} from "@/lib/base-repo/client-utils";
import Forbidden from "@/app/base-repo/resources/forbidden";

export default function Page({params}: { params: { id: string } }) {
    const id = params.id;
    const [resource, setResource] = useState(undefined);
    const [schema, setSchema] = useState(undefined);
    const [etag, setEtag] = useState(undefined);
    const [isLoading, setLoading] = useState(true)
    const {data, status } = useSession();

    useEffect(() => {
        fetchSchema("/definitions/base-repo/models/resourceModel.json").
        then(schema => setSchema(schema));

        fetchDataResource(id).then(async (res) => {
            await fetchDataResourceEtag(res.id).
            then(result => setEtag(result)).
            catch(error => {console.error(`Failed to obtain etag for resource ${id}`, error)});
            return res;
        }).then(async (res) => {
            await loadContent(res).
            then((data) => res.children = data).
            catch(error => {console.error(`Failed to fetch children for resource ${id}`, error)});
            return setResource(res);
        }).
        catch(error => {console.log(`Failed to fetch resource ${id}`, error)}).
        finally(() => setLoading(false));
    }, [id, resource]);

    if (isLoading) return <p>Loading...</p>

    if (!resource) {
        notFound();
    }

    let permission:Permission = resourcePermissionForUser(resource, data?.user.id, data?.groups);
    if(permission < Permission.WRITE.valueOf()) {
        return <Forbidden/>
    }

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

            <div className="flex">
                <div className="block min-w-full align-middle">
                    <div className="rounded-lg p-2 md:pt-0">
                        <DataResourceEditor schema={schema} data={resource} content={resource.children} etag={etag}/>
                    </div>
                </div>
            </div>
            <ToastContainer/>

        </main>
    );
}
