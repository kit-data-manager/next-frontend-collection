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
import {fetchMappingPlugins, fetchMappings} from "@/lib/mapping/client_data";

export default async function MappingServiceStats() {

    /*const {
        uniqueUsers,
        resources,
        openResources,
        closedResources,
        files,
        size
    } = await fetchContentOverview();*/

    const plugins = await fetchMappingPlugins();
    const mappings = await fetchMappings();

    const stats = [
        {
            "text": "Plugin(s)",
            "value": formatNumber(plugins.length),
            "icon": UserIcon
        },
        {
            "text": "Mapping(s)",
            "value": formatNumber(mappings.length),
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
