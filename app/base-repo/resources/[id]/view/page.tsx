'use client';

import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import {fetchAllContentInformation, fetchDataResource, fetchDataResourceEtag} from "@/lib/base-repo/client_data";
import DataResourceCard from "@/app/base-repo/components/DataResourceCard/DataResourceCard";
import React, {useEffect, useState} from "react";
import {userCanDelete, userCanDownload, userCanEdit} from "@/lib/event-utils";
import SectionCaption from "@/components/SectionCaption/SectionCaption";
import {DataResource, Permission, State} from "@/lib/definitions";
import {useSession} from "next-auth/react";
import ErrorPage from "@/components/ErrorPage/ErrorPage";
import {Errors} from "@/components/ErrorPage/ErrorPage.d";
import Loader from "@/components/general/Loader";
import {permissionToNumber, resourcePermissionForUser} from "@/lib/permission-utils";
import {EditResourceAction} from "@/lib/actions/base-repo/editResourceAction";
import {DownloadResourceAction} from "@/lib/actions/base-repo/downloadResourceAction";
import {ActionButtonInterface} from "@/app/base-repo/components/DataResourceCard/DataResourceCard.d";
import {DeleteResourceAction} from "@/lib/actions/base-repo/deleteResourceAction";
import {RevokeResourceAction} from "@/lib/actions/base-repo/revokeResourceAction";
import {ToastContainer} from "react-toastify";
import {useDebouncedCallback} from "use-debounce";
import {runAction} from "@/lib/actions/actionExecutor";
import {useRouter} from "next/navigation";

export default function Page({params}) {
    const used = React.use(params) as { id: string };
    const id = used.id;

    const [resource, setResource] = useState({} as DataResource);
    const [etag, setEtag] = useState({} as string);
    const [isLoading, setLoading] = useState(true)
    const {data, status} = useSession();
    const actionEvents: ActionButtonInterface[] = [];
    const router = useRouter();

    const handleAction = useDebouncedCallback((event, resource: DataResource) => {
        const eventIdentifier: string = event.detail.eventIdentifier;

        runAction(eventIdentifier, data?.accessToken, (redirect: string) => {
            router.push(redirect);
        });
    });
    useEffect(() => {
        setLoading(true);
        fetchDataResource(id, data?.accessToken).then(async (res) => {
            await fetchDataResourceEtag(res.id, data?.accessToken).then(result => setEtag(result as string)).catch(error => {
                console.error(`Failed to obtain etag for resource ${id}`, error)
            });
            return res;
        }).then(async (res) => {
            await fetchAllContentInformation(res, data?.accessToken).then((data) => res.children = data).catch(error => {
                console.error(`Failed to fetch children for resource ${id}`, error)
            });
            setResource(res);
        }).then(() => {
            setLoading(false);
        }).catch(error => {
            console.log(`Failed to fetch resource ${id}`, error)
            setLoading(false);
        })
    }, [id, data?.accessToken]);

    if (!id) {
        return ErrorPage({errorCode: Errors.NotFound, backRef: "/base-repo/resources"})
    }

    if (status === "loading" || isLoading) {
        return <Loader/>;
    }

    if (!resource || !resource.id) {
        return ErrorPage({errorCode: Errors.NotFound, backRef: "/base-repo/resources"})
    }

    let permission: 0 | 1 | 2 | 3 = resourcePermissionForUser(resource, data?.user.preferred_username, data?.user.groups);

    if (permission < permissionToNumber(Permission.READ)) {
        return ErrorPage({errorCode: Errors.Forbidden, backRef: "/base-repo/resources"})
    }

    if (userCanEdit(resource, data?.user.preferred_username, data?.user.groups)) {
        actionEvents.push(new EditResourceAction(resource.id).getDataCardAction());
    }

    if (userCanDelete(resource, data?.user.preferred_username, data?.user.groups)) {
        if (resource.state == State.REVOKED) {
            actionEvents.push(new DeleteResourceAction(resource.id, etag).getDataCardAction());
        } else {
            actionEvents.push(new RevokeResourceAction(resource.id, etag).getDataCardAction());
        }
    }

    if (userCanDownload(resource, data?.user.preferred_username, data?.user.groups)) {
        actionEvents.push(new DownloadResourceAction(resource.id).getDataCardAction());
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
                <div className="block min-w-full align-middle">
                    <div className="rounded-lg p-2 md:pt-0">
                        <DataResourceCard resource={resource}
                                          variant={"detailed"}
                                          actionEvents={actionEvents}
                                          cardCallbackAction={(ev, resource) => handleAction(ev, resource)}/>
                    </div>
                </div>
            </div>
            <ToastContainer/>
            {/* react-hot-toast.com */}

        </main>
    );
}
