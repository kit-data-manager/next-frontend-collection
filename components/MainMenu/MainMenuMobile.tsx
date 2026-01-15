'use client';

import {usePathname} from "next/navigation";
import React from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuPortal,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {cn} from "@/lib/general/utils";
import Link from "next/link";
import {useSession} from "next-auth/react";
import {MenuItem, SubMenu} from "@/components/MainMenu/MainMenu.d";
import {getMenuEntries, shouldRender} from "@/components/MainMenu/useMainMenu";
import {Icon} from "@iconify-icon/react";

export default function MainMenuMobile() {
    const {data: session, status} = useSession();
    const searchEnabled = process.env.NEXT_PUBLIC_SEARCH_BASE_URL != undefined;
    const pathname = usePathname();

    const items: SubMenu[] = getMenuEntries();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button id="hamburger" className="!text-primary-foreground focus:outline-none">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M4 6h16M4 12h16m-7 6h7"></path>
                    </svg>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">

                {items.map((item: SubMenu, idx: number) => {
                    if(item.menuItems){
                    return (
                        <DropdownMenuSub key={`main_menu_${idx}`}>
                            <DropdownMenuSubTrigger>
                                <span>{item.serviceName}</span>
                            </DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent>
                                    {item.menuItems.map((menuItem: MenuItem, idx2: number) => {
                                        if (shouldRender(menuItem, session != null, searchEnabled)) {
                                            return (
                                                <DropdownMenuItem key={`sub_menu_${idx2}`}>
                                                    <Link
                                                        key={menuItem.name}
                                                        href={menuItem.href}
                                                        className={cn(
                                                            'flex h-[24px] items-center justify-center gap-2 hover:underline font-medium m-2',
                                                            {
                                                                'underline': pathname === menuItem.href,
                                                            },
                                                        )}
                                                    >
                                                        {menuItem.icon ? <Icon icon={menuItem.icon} width={"1em"} height={"1em"} className="w-4"/>:null}
                                                        <p className="md:block">{menuItem.name}</p>
                                                    </Link>
                                                </DropdownMenuItem>
                                            )
                                        }
                                    })}
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
                    )}else{
                        return ( <Link
                            key={item.serviceName}
                            href={item.href ? item.href : ""}
                            className={cn(
                                'flex h-[24px] items-start !text-primary-foreground justify-start gap-2 hover:underline font-medium m-2',
                                {
                                    'underline': pathname === item.href,
                                },
                            )}
                        >
                            {item.icon ?
                            <Icon icon={item.icon} width={"1em"} height={"1em"} className="w-4"/>
                                :null}
                            <p className="md:block">{item.serviceName}</p>
                        </Link>)
                    }
                })}
            </DropdownMenuContent>
        </DropdownMenu>
    )
    /**
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
     * */
}
