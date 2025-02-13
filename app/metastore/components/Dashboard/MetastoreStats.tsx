import {formatNumber, humanFileSize} from "@/lib/general/format-utils";
import {fetchMetastoreOverview} from "@/lib/metastore/server-data";
import {InfoCard} from "@/components/StatusCard/InfoCard";
import {useEffect, useState} from "react";

export default function MetastoreStats() {

    const [users, setUsers] = useState(-1);
    const [resources, setResources] = useState(-1);
    const [openResources, setOpenResources] = useState(-1);
    const [closedResources, setClosedResources] = useState(-1);
    const [schemas, setSchemas] = useState(-1);
    const [metadata, setMetadata] = useState(-1);

    useEffect(() => {

      /*  const {
            uniqueUsers,
            resources,
            openResources,
            closedResources,
            schemas,
            metadata
        } = fetchMetastoreOverview();
        */

        setUsers(1);
        setResources(1);
        setOpenResources(1);
        setClosedResources(1);
        setSchemas(1);
        setMetadata(1);
    }, [])

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
            "text": "Schemas",
            "value": formatNumber(schemas),
            "icon": "lucide:file-json"
        },
        {
            "text": "Metadata Documents",
            "value": formatNumber(metadata),
            "icon": "bxs:file-json"
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
                const Icon = stat.icon;
                return (
                    <InfoCard key={i} icon={stat.icon} value={stat.value} text={stat.text}/>
                );
            })}
        </>
    );
}
