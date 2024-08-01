import {
    DocumentIcon,
    DocumentTextIcon,
    CircleStackIcon,
    LockOpenIcon,
    LockClosedIcon,
    UserIcon
} from '@heroicons/react/24/outline';

import {lusitana} from '@/components/fonts';
import {StatusCard} from "@/components/StatusCard/StatusCard";
import {fetchContentOverview} from "@/lib/base-repo/data";
import {formatNumber, humanFileSize} from "@/lib/format-utils";

export default async function RepositoryStats() {

    const {
        uniqueUsers,
        resources,
        openResources,
        closedResources,
        files,
        size
    } = await fetchContentOverview();

    const stats = [
        {
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
        <>
            {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                    <StatusCard key={i}
                                cardStatus={
                                    {
                                        title: stat.value,
                                        subtitle: stat.text,
                                        icon: <Icon className="w-6 h-6"/>,
                                        status: 0
                                    }
                                }/>
                );
            })}
        </>
    );
}
