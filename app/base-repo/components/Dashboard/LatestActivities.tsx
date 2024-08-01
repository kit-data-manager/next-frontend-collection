import {
    ArrowPathIcon,
    XCircleIcon,
    PlusCircleIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import {lusitana} from '@/components/fonts';
import {fetchLatestActivities} from "@/lib/base-repo/data";
import {CreatorLabel} from "@/app/base-repo/components/CreatorLabel/CreatorLabel";
import * as React from "react";
import Link from "next/link";
import {formatDateToLocal} from "@/lib/format-utils";
import LatestActivitiesSkeleton from "@/app/base-repo/components/Dashboard/LatestActivitiesSkeleton";
import { Suspense } from 'react';
const iconMap = {
    INITIAL: PlusCircleIcon,
    UPDATE: ArrowPathIcon,
    TERMINAL: XCircleIcon
};
export default async function LatestActivities() {

    console.log("START");
    const latestActivities = await fetchLatestActivities()
    console.log("DONE");
    return (
                <div className="bg-white px-6">
                    {
                        latestActivities.length < 1 ? (
                        <div className='flex flex-row items-center justify-between py-4'>
                            <div className="flex items-center">
                                <XCircleIcon className='h-5 w-5  mr-5 text-green-500'/>
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold md:text-base">
                                       No activities captured so far.
                                    </p>
                                    <span className="text-xs text-gray-500 sm:block">
                                            <CreatorLabel firstname={"System"}/>
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : null
                    }
                    {
                        latestActivities.map((activity, i) => {
                            const Icon = iconMap[activity.type];
                            const id = JSON.parse(activity.state).id;
                            return (
                                <div
                                    key={activity.id}
                                    className='flex flex-row items-center justify-between py-4 gap-2 border-t border-b p-2'
                                >
                                    <div className="flex items-center">
                                        {Icon ? <Icon className={clsx(`h-5 w-5  mr-5`, {
                                            'text-red-500': activity.type === "TERMINAL",
                                            'text-yellow-500': activity.type === "UPDATE",
                                            'text-green-500': activity.type === "INITIAL"
                                        })
                                        }/> : null}
                                        <div className="min-w-0">
                                            {(activity.type === "INITIAL" || activity.type === "UPDATE") ? (
                                                <Link className="truncate text-sm font-semibold md:text-base hover:bg-sky-100 hover:text-blue-600" href={`/base-repo/resources/${id}/view`}>
                                                    {activity.managed_type == "edu.kit.datamanager.repo.domain.ContentInformation" ? "File" : "Resource"}
                                                    {activity.type === "UPDATE" ? " updated" : ""}
                                                    {activity.type === "INITIAL" ? " created" : ""}
                                                </Link>
                                            ) : (
                                                <p className="truncate text-sm font-semibold md:text-base">
                                                    {activity.managed_type == "edu.kit.datamanager.repo.domain.ContentInformation" ? "File" : "Resource"}
                                                    {activity.type === "TERMINAL" ? " deleted" : ""}
                                                </p>
                                            )

                                            }
                                            <span className="text-xs text-gray-500 sm:block">
                                            <CreatorLabel firstname={activity.author}/>
                                        </span>
                                        </div>
                                    </div>
                                    <div className="flex min-w-0 items-start">
                                <span
                                    className={`${lusitana.className} antialiased top-0 right-0 h-8 truncate text-xs font-small md:text-small`}>
                                    {formatDateToLocal(activity.commit_date)}
                                </span>
                                </div>
                            </div>
                        );
                    })}
                </div>
)}
