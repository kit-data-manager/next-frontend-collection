'use client';

import {useTheme} from "next-themes";
import {ChartPieIcon, ListBulletIcon, PlusCircleIcon} from "@heroicons/react/24/outline";
import {usePathname} from "next/navigation";
import React from "react";
import {DropdownMenuCheckboxItemProps} from "@radix-ui/react-dropdown-menu";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuItem,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuPortal,
    DropdownMenuSubContent
} from "@/components/ui/dropdown-menu";
import {cn} from "@/lib/utils";
import Link from "next/link";
import {ThemeModeToggle} from "@/components/ThemeModeToggle/ThemeModeToggle";
import {useSession} from "next-auth/react";

export default function MainMenuMobile() {
    const {data: session, status} = useSession();
    const searchEnabled = process.env.SEARCH_BASE_URL != undefined;
    const pathname = usePathname();

    //init base menu entries
    const linksDataRepo = [
        {name: 'Overview', href: '/base-repo', icon: ChartPieIcon, description:"Show status information."},
    ];
    const linksMetadataRepo = [
        {name: 'Overview', href: '/metadata-repo', icon: ChartPieIcon},
    ];

    //if session available, add create entries
    if(session){
        linksDataRepo.push(
            {name: 'Create Resource', href: '/base-repo/resources/create', icon: PlusCircleIcon, description:"Show status information."}
        );
        linksMetadataRepo.push(
            {name: 'Create Schema', href: '/metadata-repo/schema/create', icon: PlusCircleIcon},
            {name: 'Create Metadata', href: '/metadata-repo/metadata/create', icon: PlusCircleIcon}
        );
    }

    //if search enabled, add search entries
    if(searchEnabled){
        linksDataRepo.push(
            {name: 'Search', href: '/base-repo/resources/search', icon: PlusCircleIcon, description:"Show status information."},
        );
        linksMetadataRepo.push(
            {name: 'Search', href: '/metadata-repo/metadata/search', icon: PlusCircleIcon},
        );
    }

    //add remaining entries
    linksDataRepo.push(
        {name: 'Resources', href: '/base-repo/resources', icon: ListBulletIcon, description:"Show status information."}
    );
    linksMetadataRepo.push(
        {name: 'Schemas', href: '/metadata-repo/schemas', icon: ListBulletIcon},
        {name: 'Metadata', href: '/metadata-repo/metadata', icon: ListBulletIcon}
    );

   /* type Checked = DropdownMenuCheckboxItemProps["checked"]

    const [showStatusBar, setShowStatusBar] = React.useState<Checked>(true)
    const [showActivityBar, setShowActivityBar] = React.useState<Checked>(false)
    const [showPanel, setShowPanel] = React.useState<Checked>(false)*/

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button id="hamburger" className="text-white focus:outline-none">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M4 6h16M4 12h16m-7 6h7"></path>
                    </svg>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                        <span>Data Repository</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                            {linksDataRepo.map((link, cnt) => {
                                const LinkIcon = link.icon;

                                return (
                                    <DropdownMenuItem key={cnt}>
                                        <Link
                                            key={link.name}
                                            href={link.href}
                                            className={cn(
                                                'flex h-[24px] items-center justify-center gap-2 hover:underline font-medium m-2',
                                                {
                                                    'underline': pathname === link.href,
                                                },
                                            )}
                                        >
                                            <LinkIcon className="w-6"/>
                                            <p className="md:block">{link.name}</p>
                                        </Link>
                                    </DropdownMenuItem>
                                );
                            })}
                        </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                </DropdownMenuSub>
                <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                        <span>Metadata Repository</span>
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                        <DropdownMenuSubContent>
                            {linksMetadataRepo.map((link, cnt) => {
                                const LinkIcon = link.icon;

                                return (
                                    <DropdownMenuItem key={cnt}>
                                        <Link
                                            key={link.name}
                                            href={link.href}
                                            className={cn(
                                                'flex h-[24px] items-center justify-center gap-2 hover:underline font-medium m-2',
                                                {
                                                    'underline': pathname === link.href,
                                                },
                                            )}
                                        >
                                            <LinkIcon className="w-6"/>
                                            <p className="md:block">{link.name}</p>
                                        </Link>
                                    </DropdownMenuItem>
                                );
                            })}
                        </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                </DropdownMenuSub>
            </DropdownMenuContent>
        </DropdownMenu>
    )

}
