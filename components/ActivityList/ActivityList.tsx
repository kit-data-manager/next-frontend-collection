"use client";

import React from 'react';
import {Icon} from "@iconify-icon/react";
import {Activity} from "@/app/base-repo/components/Dashboard/LatestActivities";
import {XCircleIcon} from "@heroicons/react/24/outline";
import {CreatorLabel} from "@/app/base-repo/components/CreatorLabel/CreatorLabel";

export function ActivityList ({activities}: {
    activities: Array<Activity>;
}) {
    return (
        <div className="w-full max-w-3xl mx-auto rounded-lg border bg-card shadow-sm overflow-y-auto max-h-[400px]">
            <div className="px-6">
                {
                    activities.length < 1 ? (
                        <div className='flex flex-row items-center justify-between py-4'>
                            <div className="flex items-center">
                                <XCircleIcon className='h-5 w-5 mr-5'/>
                                <div className="min-w-0">
                                    <p className="truncate text-sm font-semibold md:text-base">
                                        No activities captured so far.
                                    </p>
                                    <span className="text-xs text-foreground sm:block">
                                            <CreatorLabel firstname={"System"}/>
                                    </span>
                                </div>
                            </div>
                        </div>
                    ) : null
                }
            </div>

            {activities.map((activity, index) => (
                <div
                    key={index}
                    className="flex gap-3 px-3 py-2 border-b last:border-0 items-start sm:items-center">
                    {/* Icon */}
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md">
                        <Icon
                            icon={activity.icon}
                            className="h-4 w-4"
                        />
                    </div>

                    {/* Text */}
                    <div className="flex min-w-0 flex-1 flex-col">
                        <div className="text-sm font-medium text-foreground leading-tight truncate sm:truncate-none">
                            {activity.title}
                        </div>
                        <div className="text-xs text-muted-foreground leading-tight truncate">
                            {activity.subtitle}
                        </div>
                    </div>

                    {/* Date */}
                    <div className="hidden sm:block shrink-0 text-xs text-muted-foreground">
                        {activity.date}
                    </div>
                </div>
            ))}
        </div>

    );
};

export default ActivityList;
