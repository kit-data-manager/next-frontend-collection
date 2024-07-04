import {
    DocumentIcon,
    DocumentTextIcon,
    CircleStackIcon,
    LockOpenIcon,
    LockClosedIcon,
    UserIcon
} from '@heroicons/react/24/outline';

import {lusitana} from '@/app/ui/fonts';
import {Card} from "@/app/ui/general/card";
import {fetchContentOverview} from "@/app/lib/base-repo/data";
import {formatNumber, humanFileSize} from "@/app/lib/utils";

export default async function DataRepositoryStats() {

    const {uniqueUsers,
        resources,
        openResources,
        closedResources,
        files,
        size} = await fetchContentOverview();

    const stats = [{
        "text": "Unique Users",
        "value": formatNumber(uniqueUsers),
        "icon": UserIcon
    },
        {
            "text": "Resources",
            "value": formatNumber(resources),
            "icon": DocumentIcon
        },
        {
            "text": "Public Resources",
            "value": formatNumber(openResources),
            "icon": LockOpenIcon
        },
        {
            "text": "Protected Resources",
            "value": formatNumber(closedResources),
            "icon": LockClosedIcon
        },
        {
            "text": "Files",
            "value": formatNumber(files),
            "icon": DocumentTextIcon
        },
        {
            "text": "File Size",
            "value": humanFileSize(size),
            "icon": CircleStackIcon
        }
    ]

    return (
        <div className="flex w-full flex-col md:col-span-4">
            <h2 className={`${lusitana.className} mb-4 text-l md:text-xl border-b-2 border-sky-200 rounded-sm`}>
                Content Overview
            </h2>
            <div className="grid grid-cols-2 gap-4 px-4 py-8">
                {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={i} title={stat.value} subtitle={stat.text}  icon={<Icon className="w-6 h-6"/>} status={0}/>
                    );
                })}
            </div>
        </div>
    );
}
