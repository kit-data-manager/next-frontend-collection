import {fetchContentOverview} from "@/lib/base-repo/server-data";
import {formatNumber, humanFileSize} from "@/lib/general/format-utils";
import {InfoCard} from "@/components/StatusCard/InfoCard";

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
            "icon": "clarity:users-line"
        },
        {
            "text": "Resources",
            "value": formatNumber(resources),
            "icon": "fluent-emoji-high-contrast:card-index-dividers"
        },
        {
            "text": "Files",
            "value": formatNumber(files),
            "icon": "game-icons:files"
        },
        {
            "text": "File Size",
            "value": humanFileSize(size),
            "icon": "lucide-lab:coins-stack"
        },
        {
            "text": "Public Resources",
            "value": formatNumber(openResources),
            "icon": "fontisto:unlocked"
        },
        {
            "text": "Protected Resources",
            "value": formatNumber(closedResources),
            "icon": "fontisto:locked"
        }
    ]

    return (
        <>
            {stats.map((stat, i) => {
                return (
                    <InfoCard key={i} icon={stat.icon} value={stat.value} text={stat.text}/>
                );
            })}
        </>
    );
}
