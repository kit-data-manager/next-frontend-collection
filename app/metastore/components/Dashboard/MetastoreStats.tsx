import {
    CircleStackIcon,
    DocumentIcon,
    DocumentTextIcon,
    LockClosedIcon,
    LockOpenIcon,
    UserIcon
} from '@heroicons/react/24/outline';
import {StatusCard} from "@/components/StatusCard/StatusCard";
import {formatNumber, humanFileSize} from "@/lib/general/format-utils";
import {fetchMetastoreOverview} from "@/lib/metastore/server-data";

export default async function MetastoreStats() {

    const {
        uniqueUsers,
        resources,
        openResources,
        closedResources,
        files,
        size
    } = await fetchMetastoreOverview();

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
