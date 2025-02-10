"use client"

import * as React from "react"
import {useEffect} from "react"
import {Moon, Sun} from "lucide-react"
import {useTheme} from "next-themes"

import {Button} from "@/components/ui/button"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu"
import {useSession} from "next-auth/react";
import useUserPrefs from "@/lib/hooks/useUserPrefs";

export function ThemeModeToggle(params) {
    const { data, status } = useSession();
    const { userPrefs, updateUserPrefs } = useUserPrefs(data?.user.id);

    const { setTheme } = useTheme();

    useEffect(() => {
        setTheme(userPrefs.theme);
    }, [userPrefs.theme]);

    function setThemeInternal(selection) {
        updateUserPrefs({theme: selection});
        setTheme(selection);
    }

    return (
        <DropdownMenu {...params}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" title="Toggle dark mode" size="icon" className="justify-content-center">
                    <Sun className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 dark:hidden" />
                    <Moon className="hidden dark:block rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem title="Set light mode" onClick={() => setThemeInternal("light")}>
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem title="Set dark mode" onClick={() => setThemeInternal("dark")}>
                    Dark
                </DropdownMenuItem>
                <DropdownMenuItem title="Use system settings" onClick={() => setThemeInternal("system")}>
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
