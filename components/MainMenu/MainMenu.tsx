'use client';

import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger, navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import {cn} from "@/lib/general/utils";
import React from "react";
import {useSession} from "next-auth/react";
import {getMenuEntries, shouldRender} from "@/components/MainMenu/useMainMenu";
import {MenuItem, SubMenu} from "@/components/MainMenu/MainMenu.d";
import {Icon} from "@iconify-icon/react";
import {Slot} from "@radix-ui/react-slot";
import Link from "next/link";

export default function MainMenu() {
    const searchEnabled = process.env.NEXT_PUBLIC_SEARCH_BASE_URL != undefined;
    const {data: session, status} = useSession();

    const items: SubMenu[] = getMenuEntries(true);

    return (
        <NavigationMenu className="px-2 py-2.5 sm:px-4">
            <NavigationMenuList className="flex flex-wrap gap-1 min-w-0">
                {items.map((item: SubMenu, idx: number) => {
                    if (item.menuItems) {
                        return (<NavigationMenuItem key={`main_menu_${idx}`}>
                            <NavigationMenuTrigger>{item.serviceName}</NavigationMenuTrigger>
                            <NavigationMenuContent>
                                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                                    {item.menuItems.map((menuItem: MenuItem, idx2: number) => {
                                        if (shouldRender(menuItem, session != null, searchEnabled)) {
                                            return (
                                                <ListItem
                                                    key={`sub_menu_${idx2}`}
                                                    title={menuItem.name}
                                                    href={menuItem.href}
                                                ><Icon icon={menuItem.icon} width={"1em"} height={"1em"}
                                                       className={"mr-2"}/>
                                                    {menuItem.description}
                                                </ListItem>
                                            )
                                        }
                                    })}
                                </ul>
                            </NavigationMenuContent>
                        </NavigationMenuItem>)
                    } else {
                        return (
                            <NavigationMenuItem key={`menu_${item.serviceName}`}>
                                <NavigationMenuLink
                                    href={item.href || "#"}
                                    className={cn(navigationMenuTriggerStyle(), "bg-primary")}
                                >
                                 <span className="flex items-center gap-2">
                                     {item.icon && (
                                    <Icon icon={item.icon} width="1em" height="1em"/>
                                    )}
                                     {item.serviceName}
                                </span>
                                </NavigationMenuLink>
                            </NavigationMenuItem>

                        );
                    }
                })}
            </NavigationMenuList>
        </NavigationMenu>
    );
}

interface ListItemProps extends React.ComponentPropsWithoutRef<typeof Slot> {
    title: string,
    href?: string;
}

const ListItem = (
    {
        ref,
        className,
        title,
        children,
        ...props
    }: ListItemProps & {
        ref?: React.RefObject<HTMLAnchorElement>;
    }
) => {
    return (
        <li>
            <NavigationMenuLink asChild>
                <Link href={props.href || "#"}>
                    <div>
                        <div className="text-sm font-medium text-primary-foreground mb-2 leading-none">{title}</div>
                        <p className=" line-clamp-2 text-sm leading-snug text-muted-foreground">
                            {children}
                        </p>
                    </div>
                </Link>
            </NavigationMenuLink>
        </li>

    )
}
ListItem.displayName = "ListItem"
