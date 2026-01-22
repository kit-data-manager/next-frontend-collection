'use client';

import React, {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import {useRouter} from "next/navigation";
import {useDebouncedCallback} from "use-debounce";

import Loader from "@/components/general/Loader";
import Pagination from "@/components/general/Pagination";
import ErrorPage from "@/components/ErrorPage/ErrorPage";
import {Errors} from "@/components/ErrorPage/ErrorPage.d";
import {runAction} from "@/lib/actions/action-executor";
import {State} from "@/lib/definitions";
import {GenericListingProps} from "./GenericListingProps"

export function GenericListing<T extends { id: string; state: State }>({
                                                                           page,
                                                                           size,
                                                                           sort,
                                                                           fetchPage,
                                                                           renderCard,
                                                                           buildActions,
                                                                           backRef,
                                                                       }: GenericListingProps<T>) {

    const [resources, setResources] = useState<T[]>();
    const [totalPages, setTotalPages] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    const {data, status} = useSession();
    const router = useRouter();

    const handleAction = useDebouncedCallback((event: CustomEvent, resource: T) => {
        runAction(event.detail.eventIdentifier, data?.accessToken, router.push);
    });

    useEffect(() => {
        if (status !== "loading") {
            setIsLoading(true);
            fetchPage(page, size, sort, data?.accessToken).then(p => {
                setResources(p.resources);
                setTotalPages(p.totalPages);
                setIsLoading(false);
            });
        }
    }, [page, size, sort, status, data?.accessToken]);

    if (status === "loading" || isLoading || !resources) {
        return <Loader />;
    }

    if (resources.length === 0) {
        return <ErrorPage errorCode={Errors.Empty} backRef={backRef} />;
    }

    return (
        <div>
            <div className="rounded-lg w-auto">
                {resources.map(resource => {
                    const actionEvents = buildActions(resource, data);

                    let className = "volatile_or_fixed";
                    if (resource.state === State.REVOKED) className = "revoked";
                    if (resource.state === State.GONE) className = "gone";

                    return (
                        <div key={resource.id} className={className}>
                            {renderCard({
                                resource,
                                actionEvents,
                                onAction: handleAction,
                            })}
                        </div>
                    );
                })}
            </div>

            <div className="mt-5 flex w-full justify-center">
                {totalPages > 0 && <Pagination totalPages={totalPages} />}
            </div>
        </div>
    );
}
