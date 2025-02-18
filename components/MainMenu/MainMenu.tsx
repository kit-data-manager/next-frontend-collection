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
import Link from "next/link";

export default function MainMenu() {
    const searchEnabled = process.env.NEXT_PUBLIC_SEARCH_BASE_URL != undefined;
    const {data: session, status} = useSession();

    const items:SubMenu[] = getMenuEntries(true);

    return (
        <NavigationMenu className="px-2 py-2.5 sm:px-4">
            <NavigationMenuList>
                {items.map((item:SubMenu, idx:number) => {
                    if(item.menuItems){
                       return (<NavigationMenuItem key={`main_menu_${idx}`}>
                           <NavigationMenuTrigger>{item.serviceName}</NavigationMenuTrigger>
                           <NavigationMenuContent>
                               <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                                   {item.menuItems.map((menuItem:MenuItem, idx2:number) => {
                                      if(shouldRender(menuItem, session != null, searchEnabled)){
                                       return (<ListItem
                                               key={`sub_menu_${idx2}`}
                                               title={menuItem.name}
                                               href={menuItem.href}
                                           >
                                               {menuItem.description}
                                           </ListItem>
                                       )}})}
                               </ul>
                           </NavigationMenuContent>
                       </NavigationMenuItem>
                    }else{
                    return (
                        <NavigationMenuItem>
                            <Link href={item.href} legacyBehavior passHref>
                                <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                    Documentation
                                </NavigationMenuLink>
                            </Link>
                        </NavigationMenuItem>
                    )
                }
                )})}
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
