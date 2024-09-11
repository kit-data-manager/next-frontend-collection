'use client';

import {Button, MegaMenu, Navbar} from 'flowbite-react';
import {
    ChartPieIcon, ListBulletIcon, PlusCircleIcon
} from '@heroicons/react/24/outline';
import Link from "next/link";
import {useTheme} from "next-themes"
import {usePathname} from "next/navigation";
import clsx from "clsx";

import {mainMenuTheme} from "@/components/MainMenu/MainMenu.d";
import {ThemeModeToggle} from "@/components/ThemeModeToggle/ThemeModeToggle";
import {
    NavigationMenu, NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList, NavigationMenuTrigger, navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import {cn} from "@/lib/utils";
import React from "react";

export default function MainMenu(props) {
    const theme = useTheme()
    const showLogin = props.authAvailable;

    const linksDataRepo = [
        {name: 'Overview', href: '/base-repo', icon: ChartPieIcon, description:"Show status information."},
        {name: 'Create Resource', href: '/base-repo/resources/create', icon: PlusCircleIcon, description:"Show status information."},
        {name: 'Search', href: '/base-repo/resources/search', icon: PlusCircleIcon, description:"Show status information."},
        {name: 'Resources', href: '/base-repo/resources', icon: ListBulletIcon, description:"Show status information."},
    ];

    const linksMetadataRepo = [
        {name: 'Overview', href: '/metadata-repo', icon: ChartPieIcon},
        {name: 'Create Schema', href: '/metadata-repo/schema/create', icon: PlusCircleIcon},
        {name: 'Create Metadata', href: '/metadata-repo/metadata/create', icon: PlusCircleIcon},
        {name: 'Search', href: '/metadata-repo/metadata/search', icon: PlusCircleIcon},
        {name: 'Schemas', href: '/metadata-repo/schemas', icon: ListBulletIcon},
        {name: 'Metadata', href: '/metadata-repo/metadata', icon: ListBulletIcon},
    ];

    const pathname = usePathname();
    const searchEnabled = process.env.SEARCH_BASE_URL != undefined;


    return (
        <NavigationMenu className="px-2 py-2.5 sm:px-4 ">
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
                    <NavigationMenuContent>
                        <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                            <li className="row-span-3">
                                <NavigationMenuLink asChild>
                                    <a
                                        className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                                        href="/"
                                    >
                                        <div className="mb-2 mt-4 text-lg font-medium">
                                            shadcn/ui
                                        </div>
                                        <p className="text-sm leading-tight text-muted-foreground">
                                            Beautifully designed components that you can copy and
                                            paste into your apps. Accessible. Customizable. Open
                                            Source.
                                        </p>
                                    </a>
                                </NavigationMenuLink>
                            </li>
                            <ListItem href="/docs" title="Introduction">
                                Re-usable components built using Radix UI and Tailwind CSS.
                            </ListItem>
                            <ListItem href="/docs/installation" title="Installation">
                                How to install dependencies and structure your app.
                            </ListItem>
                            <ListItem href="/docs/primitives/typography" title="Typography">
                                Styles for headings, paragraphs, lists...etc
                            </ListItem>
                        </ul>
                    </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuTrigger>Components</NavigationMenuTrigger>
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
                    <Link href="/docs" legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                            Documentation
                        </NavigationMenuLink>
                    </Link>
                </NavigationMenuItem>
            </NavigationMenuList>
        </NavigationMenu>

    );
}

const ListItem = React.forwardRef<
    React.ElementRef<"a">,
    React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
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
