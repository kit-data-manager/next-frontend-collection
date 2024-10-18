'use client';

import {
    ChartPieIcon, ListBulletIcon, PlusCircleIcon
} from '@heroicons/react/24/outline';
import {
    NavigationMenu, NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList, NavigationMenuTrigger
} from "@/components/ui/navigation-menu";
import {cn} from "@/lib/utils";
import React from "react";
import {useSession} from "next-auth/react";

export default function MainMenu(props) {
    const searchEnabled = process.env.SEARCH_BASE_URL != undefined;
    const {data: session, status} = useSession();

    const linksDataRepo = [
        {name: 'Overview', href: '/base-repo', icon: ChartPieIcon, description: "Show system status information."},
    ];

    if (session) {
        linksDataRepo.push({
            name: 'Create Resource',
            href: '/base-repo/resources/create',
            icon: PlusCircleIcon,
            description: "Create a new Data Resource."
        });
    }

    if (searchEnabled) {
        linksDataRepo.push({
            name: 'Search',
            href: '/base-repo/resources/search',
            icon: PlusCircleIcon,
            description: "Search for Data Resources."
        });
    }

    linksDataRepo.push({
        name: 'Resources',
        href: '/base-repo/resources',
        icon: ListBulletIcon,
        description: "List all Data Resources."
    });

    const linksMetadataRepo = [
        {name: 'Overview', href: '/metadata-repo', icon: ChartPieIcon, description: "Show system status information."}
    ];

    if (session) {
        linksMetadataRepo.push({
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
            }
        );
    }

    if (searchEnabled) {
        linksMetadataRepo.push({
            name: 'Search',
            href: '/metadata-repo/metadata/search',
            icon: PlusCircleIcon,
            description: "Search for Metadata Documents."
        });
    }

    linksMetadataRepo.push(
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
    );
    {"entry":{"title":"SCeO5_00","program":{"programVersion":"V06.00.00.00 : 09-Jun-16"},"user":{"userName":"SABINE"},"instrument":{"instrumentName":"Zeiss Auriga","instrumentManufacturer":{"modelName":"Auriga 60-46-18"},"chamberPressure":{"value":0.00000409,"unit":"mbar"},"eBeamSource":{"accelerationVoltage":{"value":5,"unit":"kV"},"beamCurrent":{"unit":"µA","value":80}},"stage":{"stageAlignmentDone":true,"stageTiltAngle":{"value":0,"unit":"degree"},"coordinates":{"xValue":55.8593,"coordinatesUnit":"mm","yValue":74.4853,"zValue":27.045},"eBeamWorkingDistance":{"value":1.7,"unit":"mm"},"tiltCorrectionType":"none"},"FIB":{"iBeamWorkingDistance":{"value":0,"unit":"mm"},"angleToEBeam":{"value":54,"unit":"degree"},"FIBProbe":"30kV:50pA","iBeamSource":{"accelerationVoltage":{"value":0,"unit":"kV"},"beamCurrent":{"value":0.2,"unit":"µA"},"sourceLifetime":{"value":2309.29,"unit":"µAh"},"gunPressure":{"value":2.11e-8,"unit":"mbar"}},"gasInjectionSystem":{"GISName":"None"},"FIBSpotSize":{"value":16.03,"unit":"nm"},"FIBExtractor":{"value":0,"unit":"kV"}},"imaging":{"numberOfPixels":{"xPixels":1024,"yPixels":768},"pixelSize":{"xPixelSize":{"value":2.233,"unit":"nm"}},"apertureSetting":{"size":{"value":30,"unit":"µm"}},"dwellTime":{"value":100,"unit":"ns"}},"detectors":{"signalMixingDone":false,"detector1":{"detectorName":"Signal A","detectorBias":{"value":300,"unit":"V"}}},"eBeamDeceleration":{"stageBias":{"value":0,"unit":"V"}}},"endTime":"2023-03-22T13:49:38","technique":"SEM","measurementPurpose":{"measurementPurposeOptions":["completeness check (presence or absence of given properties)"]},"parents":[{"parentType":"sample","parentReferenceType":"plain text","parentReference":"test parent property "}]}}
    return (
        <NavigationMenu className="px-2 py-2.5 sm:px-4">
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Data Repository</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                            {linksDataRepo.map((component) => (
                                <ListItem
                                    key={component.name}
                                    title={component.name}
                                    href={component.href}
                                >
                                    {component.description}
                                </ListItem>
                            ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Metadata Repository</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                            {linksMetadataRepo.map((component) => (
                                <ListItem
                                    key={component.name}
                                    title={component.name}
                                    href={component.href}
                                >
                                    {component.description}
                                </ListItem>
                            ))}
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>

    );
}

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({className, title, children, ...props}, ref) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <a
                    ref={ref}
                    className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    {...props}
                >
                    <div className="text-sm font-medium leading-none">{title}</div>
                    <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {children}
                    </p>
                </a>
            </NavigationMenuLink>
        </li>
    )
})
ListItem.displayName = "ListItem"
