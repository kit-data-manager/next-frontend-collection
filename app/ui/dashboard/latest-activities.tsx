import {
    ArrowPathIcon,
    CircleStackIcon,
    CodeBracketSquareIcon,
    HashtagIcon,
    XCircleIcon,
    PlusCircleIcon
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import {lusitana} from '@/app/ui/fonts';
import {fetchLatestActivities} from "@/app/lib/base-repo/data";
import {Creator} from "@/app/ui/dataresources/creator";
import * as React from "react";
import Link from "next/link";
import {formatDateToLocal} from "@/app/lib/format-utils";
const iconMap = {
    INITIAL: PlusCircleIcon,
    UPDATE: ArrowPathIcon,
    TERMINAL: XCircleIcon
};
export default async function LatestActivities() {
    const latestActivities = await fetchLatestActivities()

    return (
        <div className="flex w-full flex-col md:col-span-4">
            <h2 className={`${lusitana.className} mb-4 text-l md:text-xl border-b-2 border-sky-200 rounded-sm`}>
                Latest Activities
            </h2>
            <div className="flex gap-4 px-4 py-8 grow flex-col justify-between rounded-xl ">
                <div className="bg-white px-6">
                    {
                        latestActivities.length < 1 ? (
                        <div
                            className='flex flex-row items-center justify-between py-4'
                        >
                            <div className="flex items-center">
                                <XCircleIcon className='h-5 w-5  mr-5 text-green-500'/>
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold md:text-base">
                                       No activities captured so far.
                                    </p>
                                    <span className="text-xs text-gray-500 sm:block">
                                            <Creator firstname={"System"}/>
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
                            console.log(id);
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
                                            <Creator firstname={activity.author}/>
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
            </div>
        </div>
    );
}
