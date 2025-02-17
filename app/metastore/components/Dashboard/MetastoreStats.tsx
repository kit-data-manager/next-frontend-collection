import {formatNumber} from "@/lib/general/format-utils";
import {fetchMetastoreOverview} from "@/lib/metastore/server-data";
import {InfoCard} from "@/components/StatusCard/InfoCard";
import {MetastoreStatsType} from "@/lib/definitions";

export default async function MetastoreStats() {

    const metastoreStats: MetastoreStatsType = await fetchMetastoreOverview();

    const stats = [
        {
            "text": "Unique Users",
            "value": formatNumber(metastoreStats.uniqueUsers),
            "icon": "clarity:users-line"
        },
        {
            "text": "Resources",
            "value": formatNumber(metastoreStats.resources),
            "icon": "fluent-emoji-high-contrast:card-index-dividers"
        },
        {
            "text": "Schemas",
            "value": formatNumber(metastoreStats.schemas),
            "icon": "lucide:file-json"
        },
        {
            "text": "Metadata Documents",
            "value": formatNumber(metastoreStats.metadata),
            "icon": "bxs:file-json"
        },
        {
            "text": "Public Resources",
            "value": formatNumber(metastoreStats.openResources),
            "icon": "fontisto:unlocked"
        },
        {
            "text": "Protected Resources",
            "value": formatNumber(metastoreStats.closedResources),
            "icon": "fontisto:locked"
        }
    ]

    return (
        <>
            {stats.map((stat, i) => {
                const Icon = stat.icon;
                return (
                    <InfoCard key={i} icon={stat.icon} value={stat.value} text={stat.text}/>
                );
            })}
        </>
    );
}
