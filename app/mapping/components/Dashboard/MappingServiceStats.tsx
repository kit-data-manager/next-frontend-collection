'use client'

import {
    ArrowPathIcon, DocumentDuplicateIcon,
    PlayIcon, PuzzlePieceIcon
} from '@heroicons/react/24/outline';

import {StatusCard} from "@/components/StatusCard/StatusCard";
import {formatNumber} from "@/lib/format-utils";
import {fetchMappingPlugins, fetchMappings} from "@/lib/mapping/client_data";
import useMappingStore, {JobStore} from "@/app/mapping/components/MappingListing/MappingStore";
import {useEffect, useState} from "react";
import {Puzzle} from "lucide-react";

export default function MappingServiceStats() {

   // const plugins = await fetchMappingPlugins();
   // const mappings = await fetchMappings(1,1);
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
            "icon": PuzzlePieceIcon
        },
        {
            "text": "Mapping(s)",
            "value": mappings > -1 ? formatNumber(mappings) : "Loading...",
            "icon": DocumentDuplicateIcon
        },
        {
            "text": "Mapping Jobs",
            "value": formatNumber(jobStore.mappingStatus.length) + " / 20",
            "icon": PlayIcon
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
