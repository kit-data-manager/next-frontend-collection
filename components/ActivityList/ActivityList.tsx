"use client";

import React from 'react';
import { Icon } from '@iconify/react';
import {Activity} from "@/app/base-repo/components/Dashboard/LatestActivities";

export function ActivityList ({activities}: {
    activities: Array<Activity>;
}) {
    return (
        <div className="w-full max-w-3xl mx-auto rounded-lg border bg-card text-card-foreground shadow-sm overflow-y-auto h-[400px]">
            {activities.map((activity, index) => (
                <div key={index} className="flex items-start border-b last:border-0">
                    {/* Icon Section */}
                    <div className="w-1/5 flex items-center bg-card p-3 brightness-150 justify-center h-full">
                        <Icon icon={activity.icon} width="40" height="40" />
                    </div>

                    {/* Title and Subtitle Section */}
                    <div className="w-2/5 pl-4">
                        <div className="text-l font-semibold text-card-800 mt-2">{activity.title}</div>
                        <div className="text-sm text-gray-600">{activity.subtitle}</div>
                    </div>

                    {/* Date Section */}
                    <div className="w-2/5 text-right text-sm text-gray-500 m-2">
                        {activity.date}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ActivityList;
