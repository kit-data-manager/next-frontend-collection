'use client';

import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import {fetchDataResource, loadContent} from "@/lib/base-repo/client_data";
import DataResourceCard from "@/app/base-repo/components/DataResourceCard/DataResourceCard";
import React, {useEffect, useState} from "react";
import {downloadEventIdentifier, editEventIdentifier} from "@/lib/event-utils";
import SectionCaption from "@/components/SectionCaption/SectionCaption";
import {ExtendedSession, Permission} from "@/lib/definitions";
import {resourcePermissionForUser} from "@/lib/base-repo/client-utils";
import {useSession} from "next-auth/react";
import ErrorPage from "@/components/ErrorPage/ErrorPage";
import {Errors} from "@/components/ErrorPage/ErrorPage.d";
import Loader from "@/components/general/Loader";
import {useParams} from "next/navigation";

export default function Page() {
    const id = useParams<{ id: string; }>()?.id;
    const [resource, setResource] = useState(undefined);
    const [isLoading, setLoading] = useState(true)
    const { data, status } = useSession() as {data: ExtendedSession, status: string};
    const actionEvents: string[] = [];

    useEffect(() => {
        fetchDataResource(id, data.accessToken).
        then(async (res) => {
            await loadContent(res, data.accessToken).
            then((data) => {
                res.children = data;
                setResource(res)
            }).
            catch(error => {console.error(`Failed to fetch children for resource ${id}`, error); throw error;})
        }).
        catch(error => {console.log(`Failed to fetch resource ${id}`, error)}).
        finally(() => setLoading(false));
    }, [id, data.accessToken, resource]);

    if(!id){
        return ErrorPage({errorCode: Errors.NotFound, backRef: "/base-repo/resources"})
    }

    if (!isLoading) {
        if (!resource) {
            return ErrorPage({errorCode: Errors.NotFound, backRef: "/base-repo/resources"})
        }

        let permission: Permission = resourcePermissionForUser(resource, data?.user.id, data?.groups);
        if (permission < Permission.READ.valueOf()) {
            return ErrorPage({errorCode: Errors.Forbidden, backRef: "/base-repo/resources"})
        }

        actionEvents.push(editEventIdentifier(id));
        actionEvents.push(downloadEventIdentifier(id));
    }

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
                    {isLoading ?
                        <Loader/> :
                        resource ? <DataResourceCard key={id} data={resource} variant={"detailed"} actionEvents={actionEvents}></DataResourceCard> : <Loader/>
                    }
                </div>
            </div>
        </main>
    );
}
