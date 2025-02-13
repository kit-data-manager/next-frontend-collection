'use client'

import {DocumentDuplicateIcon, PlayIcon, PuzzlePieceIcon} from '@heroicons/react/24/outline';

import {StatusCard} from "@/components/StatusCard/StatusCard";
import {formatNumber} from "@/lib/general/format-utils";
import {fetchMappingPlugins, fetchMappings} from "@/lib/mapping/client-data";
import useMappingStore, {JobStore} from "@/app/mapping/components/MappingListing/MappingStore";
import {useEffect, useState} from "react";
import {InfoCard} from "@/components/StatusCard/InfoCard";

export default function MappingServiceStats() {

    const jobStore:JobStore = useMappingStore.getState();
    const [mappingPlugins, setMappingPlugins] = useState(-1);
    const [mappings, setMappings] = useState(-1);


    useEffect(() => {
        fetchMappingPlugins().then((res) => {
            setMappingPlugins(res.length);
        }).then(() => {
            fetchMappings(1,1).then((res) => setMappings(res.totalPages))
        })
    }, []);

    const stats = [
        {
            "text": "Plugin(s)",
            "value": mappingPlugins > -1 ? formatNumber(mappingPlugins) : "Loading...",
            "icon": "clarity:plugin-line"
        },
        {
            "text": "Mapping(s)",
            "value": mappings > -1 ? formatNumber(mappings) : "Loading...",
            "icon": "tabler:transform"
        },
        {
            "text": "Mapping Jobs",
            "value": formatNumber(jobStore.mappingStatus.length) + " / 20",
            "icon": "fluent-mdl2:processing-run"
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
