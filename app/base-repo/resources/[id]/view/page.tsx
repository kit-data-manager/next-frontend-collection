'use client';

import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import {notFound} from "next/navigation";
import {fetchDataResource, loadContent} from "@/lib/base-repo/client_data";
import DataResourceCard from "@/app/base-repo/components/DataResourceCard/DataResourceCard";
import React, {useEffect, useState} from "react";
import {downloadEventIdentifier, editEventIdentifier} from "@/lib/event-utils";
import SectionCaption from "@/components/SectionCaption/SectionCaption";
import {DataResource, Permission} from "@/lib/definitions";
import {resourcePermissionForUser} from "@/lib/base-repo/client-utils";
import {useSession} from "next-auth/react";

export default function Page({params}: { params: { id: string } }) {
    const id = params.id;
    const [resource, setResource] = useState({} as DataResource);
    const [isLoading, setLoading] = useState(true)
    const { data, status } = useSession();

    useEffect(() => {
        fetchDataResource(id).
        then((resource) => {
            loadContent(resource).then((data) => resource.children = data);
            return setResource(resource);
        }).
        finally(() => setLoading(false));
    }, [id]);

    if (isLoading) return <p>Loading...</p>

    if (!resource) {
        notFound();
    }

    let permission:Permission = resourcePermissionForUser(resource, data?.user.id);

    if(permission < Permission.READ.valueOf()){
        notFound();
    }

    const actionEvents:string[] = [];

    if(permission.valueOf() > Permission.READ.valueOf()){
        actionEvents.push(editEventIdentifier(id));
    }

    actionEvents.push(downloadEventIdentifier(id));
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
                    <DataResourceCard key={resource.id} data={resource} variant={"detailed"}
                                      actionEvents={actionEvents}></DataResourceCard>
                </div>
            </div>
        </main>
    );
}
