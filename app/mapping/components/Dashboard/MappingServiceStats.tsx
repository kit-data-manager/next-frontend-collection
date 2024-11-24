import {
    DocumentIcon,
    LockOpenIcon,
    UserIcon
} from '@heroicons/react/24/outline';

import {StatusCard} from "@/components/StatusCard/StatusCard";
import {formatNumber} from "@/lib/format-utils";
import {fetchMappingPlugins, fetchMappings} from "@/lib/mapping/client_data";

export default async function MappingServiceStats() {

    const plugins = await fetchMappingPlugins();
    const mappings = await fetchMappings(1,1);

    const stats = [
        {
            "text": "Plugin(s)",
            "value": formatNumber(plugins.length),
            "icon": UserIcon
        },
        {
            "text": "Mapping(s)",
            "value": formatNumber(mappings.totalPages),
            "icon": DocumentIcon
        },
        {
            "text": "Performed Mappings",
            "value": formatNumber(0),
            "icon": LockOpenIcon
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
