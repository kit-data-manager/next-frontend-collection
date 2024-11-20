import {ChartPieIcon, ListBulletIcon, PlusCircleIcon, PlayIcon} from "@heroicons/react/24/outline";
import {MenuItem, SubMenu} from "@/components/MainMenu/MainMenu.d";

export function getMenuEntries(): SubMenu[] {
    const repoAvailable: boolean = (process.env.NEXT_PUBLIC_REPO_AVAILABLE ? process.env.NEXT_PUBLIC_REPO_AVAILABLE : "false") == "true";
    const metaStoreAvailable: boolean = (process.env.NEXT_PUBLIC_METASTORE_AVAILABLE ? process.env.NEXT_PUBLIC_METASTORE_AVAILABLE : "false") == "true";
    const mappingAvailable: boolean = (process.env.NEXT_PUBLIC_MAPPING_AVAILABLE ? process.env.NEXT_PUBLIC_MAPPING_AVAILABLE : "false") == "true";

    const items: SubMenu[] = [];

    if (repoAvailable) {
        items.push({
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
                    description: "Create a new Data Resource.",
                    requiresSession: true
                },
                {
                    name: 'Search',
                    href: '/base-repo/resources/search',
                    icon: PlusCircleIcon,
                    description: "Search for Data Resources.",
                    requiresSearch: true
                },
                {
                    name: 'Resources',
                    href: '/base-repo/resources',
                    icon: ListBulletIcon,
                    description: "List all Data Resources."
                }
            ]
        })
    }

    if (metaStoreAvailable) {
        items.push({
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
                    description: "Create a new Metadata Schema.",
                    requiresSession: true
                },
                {
                    name: 'Create Metadata',
                    href: '/metadata-repo/metadata/create',
                    icon: PlusCircleIcon,
                    description: "Create a new Metadata Document.",
                    requiresSession: true
                },
                {
                    name: 'Search',
                    href: '/metadata-repo/metadata/search',
                    icon: PlusCircleIcon,
                    description: "Search for Metadata Documents.",
                    requiresSearch: true
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
        });
    }

    if (mappingAvailable) {
        items.push({
            serviceName: process.env.NEXT_PUBLIC_MAPPING_INSTANCE_NAME ? process.env.NEXT_PUBLIC_MAPPING_INSTANCE_NAME : "Mapping Service",
            menuItems: [
                {
                    name: 'Overview',
                    href: '/mapping',
                    icon: ChartPieIcon,
                    description: "Show system status information."
                },
                {
                    name: 'Map',
                    href: '/mapping/map',
                    icon: PlayIcon,
                    description: "Execute Mappings."
                }
            ]
        });
    }

    return items;
}

export function shouldRender(menuItem: MenuItem, sessionAvailable:boolean, searchAvailable:boolean):boolean{
    if(menuItem.requiresSession && !sessionAvailable){
        //session required but not available
        return false;
    }
    return !(menuItem.requiresSearch && !searchAvailable);
}
