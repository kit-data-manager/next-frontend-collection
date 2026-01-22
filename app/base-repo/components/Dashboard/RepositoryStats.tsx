import {fetchContentOverview} from "@/lib/base-repo/server-data";
import {formatNumber, humanFileSize} from "@/lib/general/format-utils";
import {InfoCard} from "@/components/InfoCard/InfoCard";

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
            "icon": "grommet-icons:unordered-list"
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                {stats.map((stat, i) => {
                return (
                    <InfoCard key={i} icon={stat.icon} value={stat.value} text={stat.text}/>
                );
            })}
            </div>
    );
}
