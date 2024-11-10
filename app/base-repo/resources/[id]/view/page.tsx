'use client';

import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import {fetchDataResource, loadContent} from "@/lib/base-repo/client_data";
import DataResourceCard from "@/app/base-repo/components/DataResourceCard/DataResourceCard";
import React, {useEffect, useState} from "react";
import {
    deleteEventIdentifier,
    downloadEventIdentifier,
    editEventIdentifier, revokeEventIdentifier, userCanDelete, userCanDownload,
    userCanEdit
} from "@/lib/event-utils";
import SectionCaption from "@/components/SectionCaption/SectionCaption";
import {DataResource, Permission, State} from "@/lib/definitions";
import {useSession} from "next-auth/react";
import ErrorPage from "@/components/ErrorPage/ErrorPage";
import {Errors} from "@/components/ErrorPage/ErrorPage.d";
import Loader from "@/components/general/Loader";
import {resourcePermissionForUser} from "@/lib/permission-utils";

export default function Page({params}: { params: { id: string } }) {
    const id = params.id;
    const [resource, setResource] = useState({} as DataResource);
    const [isLoading, setLoading] = useState(true)
    const { data, status } = useSession() ;
    const actionEvents: string[] = [];


    useEffect(() => {
        fetchDataResource(id,data?.accessToken).
        then(async (res) => {
            await loadContent(res,data?.accessToken).
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
        if (!resource || !resource.id) {
            return ErrorPage({errorCode: Errors.NotFound, backRef: "/base-repo/resources"})
        }

        let permission: Permission = resourcePermissionForUser(resource, data?.user.id, data?.user.groups);
        if (permission < Permission.READ.valueOf()) {
            return ErrorPage({errorCode: Errors.Forbidden, backRef: "/base-repo/resources"})
        }

        if(userCanEdit(resource, data?.user.id, data?.user.groups)){
            actionEvents.push(editEventIdentifier(resource.id));
        }

        if(userCanDelete(resource, data?.user.id, data?.user.groups)){
            if(resource.state == State.REVOKED){
                actionEvents.push(deleteEventIdentifier(resource.id));
            }else{
                actionEvents.push(revokeEventIdentifier(resource.id));
            }
        }

        if(userCanDownload(resource, data?.user.id, data?.user.groups)){
            actionEvents.push(downloadEventIdentifier(resource.id));
        }
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
