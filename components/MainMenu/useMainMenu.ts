import {ChartPieIcon, ListBulletIcon, PlusCircleIcon} from "@heroicons/react/24/outline";

export function getRepoMenuEntries() {
    let searchEnabled = false;
    const linksDataRepo = [
        {
            serviceName: process.env.NEXT_PUBLIC_REPO_INSTANCE_NAME ? process.env.NEXT_PUBLIC_REPO_INSTANCE_NAME : "Data Repository",
            menuItems: [
                {
                    name: 'Overview',
                    href: '/base-repo',
                    icon: ChartPieIcon,
                    description: "Show system status information."
                },
                {
                    name: 'Create Resource',
                    href: '/base-repo/resources/create',
                    icon: PlusCircleIcon,
                    description: "Create a new Data Resource."
                },
                {
                    name: 'Search',
                    href: '/base-repo/resources/search',
                    icon: PlusCircleIcon,
                    description: "Search for Data Resources."
                },
                {
                    name: 'Resources',
                    href: '/base-repo/resources',
                    icon: ListBulletIcon,
                    description: "List all Data Resources."
                }
            ]
        },
        {
            serviceName: process.env.NEXT_PUBLIC_METASTORE_INSTANCE_NAME ? process.env.NEXT_PUBLIC_METASTORE_INSTANCE_NAME : "Metadata Repository",
            menuItems: [
                {
                    name: 'Overview',
                    href: '/metadata-repo',
                    icon: ChartPieIcon,
                    description: "Show system status information."
                },
                {
                    name: 'Create Schema',
                    href: '/metadata-repo/schema/create',
                    icon: PlusCircleIcon,
                    description: "Create a new Metadata Schema."
                },
                {
                    name: 'Create Metadata',
                    href: '/metadata-repo/metadata/create',
                    icon: PlusCircleIcon,
                    description: "Create a new Metadata Document."
                },
                {
                    name: 'Search',
                    href: '/metadata-repo/metadata/search',
                    icon: PlusCircleIcon,
                    description: "Search for Metadata Documents."
                },
                {
                    name: 'Schemas',
                    href: '/metadata-repo/schemas',
                    icon: ListBulletIcon,
                    description: "List all Metadata Schema."
                },
                {
                    name: 'Metadata',
                    href: '/metadata-repo/metadata',
                    icon: ListBulletIcon,
                    description: "List all Metadata Documents"
                }
            ]
        },
        {
            serviceName: process.env.NEXT_PUBLIC_MAPPING_INSTANCE_NAME ? process.env.NEXT_PUBLIC_MAPPING_INSTANCE_NAME : "Mapping Service",
            menuItems: [
                {
                    name: 'Overview',
                    href: '/mapping',
                    icon: ChartPieIcon,
                    description: "Show system status information."
                },
                {
                    name: 'Mappings',
                    href: '/mapping/mappings',
                    icon: ListBulletIcon,
                    description: "List all Mappings."
                }
            ]
        }
    ];
}