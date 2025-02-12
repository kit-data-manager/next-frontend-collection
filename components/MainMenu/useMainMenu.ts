import {ChartPieIcon, ListBulletIcon, PlayIcon, PlusCircleIcon} from "@heroicons/react/24/outline";
import {MenuItem, SubMenu} from "@/components/MainMenu/MainMenu.d";

export function getMenuEntries(withBasePath:boolean = false): SubMenu[] {
    const repoAvailable: boolean = (process.env.NEXT_PUBLIC_REPO_AVAILABLE ? process.env.NEXT_PUBLIC_REPO_AVAILABLE : "false") == "true";
    const metaStoreAvailable: boolean = (process.env.NEXT_PUBLIC_METASTORE_AVAILABLE ? process.env.NEXT_PUBLIC_METASTORE_AVAILABLE : "false") == "true";
    const mappingAvailable: boolean = (process.env.NEXT_PUBLIC_MAPPING_AVAILABLE ? process.env.NEXT_PUBLIC_MAPPING_AVAILABLE : "false") == "true";

    const basePath: string = ((withBasePath && process.env.NEXT_PUBLIC_BASE_PATH) ? process.env.NEXT_PUBLIC_BASE_PATH : "");

    const items: SubMenu[] = [];

    if (repoAvailable) {
        items.push({
            serviceName: process.env.NEXT_PUBLIC_REPO_INSTANCE_NAME ? process.env.NEXT_PUBLIC_REPO_INSTANCE_NAME : "Data Repository",
            menuItems: [
                {
                    name: 'Overview',
                    href: `${basePath}/base-repo`,
                    icon: ChartPieIcon,
                    description: "Show system status information."
                },
                {
                    name: 'Create Resource',
                    href: `${basePath}/base-repo/resources/create`,
                    icon: PlusCircleIcon,
                    description: "Create a new Data Resource.",
                    requiresSession: true
                },
                {
                    name: 'Search',
                    href: `${basePath}/base-repo/resources/search`,
                    icon: PlusCircleIcon,
                    description: "Search for Data Resources.",
                    requiresSearch: true
                },
                {
                    name: 'Resources',
                    href: `${basePath}/base-repo/resources`,
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
                    href: `${basePath}/metastore`,
                    icon: ChartPieIcon,
                    description: "Show system status information."
                },
                {
                    name: 'Create Schema',
                    href: `${basePath}/metastore/schemas/create`,
                    icon: PlusCircleIcon,
                    description: "Create a new Metadata Schema.",
                    requiresSession: true
                },
                /*{
                    name: 'Create Metadata',
                    href: `${basePath}/metastore/metadata/create`,
                    icon: PlusCircleIcon,
                    description: "Create a new Metadata Document.",
                    requiresSession: true
                },
                {
                    name: 'Search',
                    href: `${basePath}/metastore/metadata/search`,
                    icon: PlusCircleIcon,
                    description: "Search for Metadata Documents.",
                    requiresSearch: true
                },*/
                {
                    name: 'Schemas',
                    href: `${basePath}/metastore/schemas`,
                    icon: ListBulletIcon,
                    description: "List all Metadata Schema."
                },
                {
                    name: 'Metadata',
                    href: `${basePath}/metastore/metadata`,
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
                    href: `${basePath}/mapping`,
                    icon: ChartPieIcon,
                    description: "Show system status information."
                },
                {
                    name: 'Map',
                    href: `${basePath}/mapping/map`,
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
