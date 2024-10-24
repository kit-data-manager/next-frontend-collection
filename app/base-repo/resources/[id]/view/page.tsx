'use client';

import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import {notFound} from "next/navigation";
import {fetchDataResource, loadContent} from "@/lib/base-repo/client_data";
import DataResourceCard from "@/app/base-repo/components/DataResourceCard/DataResourceCard";
import React, {useEffect, useState} from "react";
import {downloadEventIdentifier, editEventIdentifier} from "@/lib/event-utils";
import SectionCaption from "@/components/SectionCaption/SectionCaption";
import {ContentInformation, DataResource, Permission} from "@/lib/definitions";
import {resourcePermissionForUser} from "@/lib/base-repo/client-utils";
import {useSession} from "next-auth/react";
import Error from "next/error";
import Forbidden from "@/app/base-repo/resources/forbidden";

export default function Page({params}: { params: { id: string } }) {
    const id = params.id;
    const [resource, setResource] = useState(undefined);
    const [isLoading, setLoading] = useState(true)
    const { data, status } = useSession();

    useEffect(() => {
        fetchDataResource(id).
        then(async (res) => {
            await loadContent(res).
            then((data) => res.children = data).
            catch(error => {console.error(`Failed to fetch children for resource ${id}`, error)});

            setResource(res);
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
    if(permission < Permission.READ.valueOf()) {
        return <Forbidden/>
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
