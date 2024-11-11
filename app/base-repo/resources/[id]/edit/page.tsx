"use client";

import DataResourceEditor from '@/app/base-repo/components/DataResourceEditor/DataResourceEditor'
import {fetchDataResource, fetchDataResourceEtag, fetchSchema, loadContent} from "@/lib/base-repo/client_data";
import React, {useEffect, useState} from "react";
import {ToastContainer} from "react-toastify";
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import SectionCaption from "@/components/SectionCaption/SectionCaption";
import {DataResource, Permission} from "@/lib/definitions";
import {useSession} from "next-auth/react";
import Loader from "@/components/general/Loader";
import ErrorPage from "@/components/ErrorPage/ErrorPage";
import {Errors} from "@/components/ErrorPage/ErrorPage.d";
import {resourcePermissionForUser} from "@/lib/permission-utils";

export default function Page({params}: { params: { id: string } }) {
    const p = React.use(params);
    const id = p.id;
    const [resource, setResource] = useState({} as DataResource);
    const [schema, setSchema] = useState(undefined);
    const [etag, setEtag] = React.useState<string | undefined | null>();
    const [isLoading, setIsLoading] = useState(true)
    const {data, status } = useSession();

    useEffect(() => {
        //@TODO Move loading logic to editor?
        if(status != "loading") {
            setIsLoading(true);
            fetchSchema("/definitions/base-repo/models/resourceModel.json").then(schema => setSchema(schema));

            fetchDataResource(id, data?.accessToken).then(async (res) => {
                await fetchDataResourceEtag(res.id, data?.accessToken).then(result => setEtag(result)).catch(error => {
                    console.error(`Failed to obtain etag for resource ${id}`, error)
                });
                return res;
            }).then(async (res) => {
                await loadContent(res, data?.accessToken).then((data) => res.children = data).catch(error => {
                    console.error(`Failed to fetch children for resource ${id}`, error)
                });
                return setResource(res);
            }).catch(error => {
                console.log(`Failed to fetch resource ${id}`, error)
            }).finally(() => setIsLoading(false));
        }
    }, [id, status]);

    if (status === "loading" || isLoading){
        return ( <Loader/> )
    }

    if (!isLoading) {
        if (!resource || !resource.id) {
            return ErrorPage({errorCode: Errors.NotFound, backRef: "/base-repo/resources"})
        }

        let permission: Permission = resourcePermissionForUser(resource, data?.user.id, data?.user.groups);
        if (permission < Permission.WRITE.valueOf()) {
            return ErrorPage({errorCode: Errors.Forbidden, backRef: "/base-repo/resources"})
        }
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
                        {isLoading ?
                            <Loader/> :
                            <DataResourceEditor schema={schema} data={resource} content={resource?.children} etag={etag}/>
                    }
                    </div>
                </div>
            </div>
            <ToastContainer/>

        </main>
    );
}
