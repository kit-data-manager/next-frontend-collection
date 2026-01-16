"use client"

import * as React from "react"
import {Moon, Sun} from "lucide-react"
import {useTheme} from "next-themes"

import {Button} from "@/components/ui/button"
import {DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu"
import {Icon} from "@iconify-icon/react";

export function ThemeModeToggle(params) {
    const { theme, setTheme } = useTheme();

    function setThemeInternal(selection) {
        setTheme(selection);
    }

    return (
        <DropdownMenu {...params}>
            <DropdownMenuTrigger asChild>
                <button
                    title="Toggle dark mode"
                    className="inline-flex h-6 w-6 items-center justify-center"
                >
                    {theme === "dark" ? (
                        <Icon width={"24"} height={"24"} className="h-6 w-6" icon="pepicons-pencil:moon-circle" />
                    ) : (
                        <Icon width={"24"} height={"24"} className="h-6 w-6" icon="pepicons-pencil:sun-circle" />
                    )}
                    <span className="sr-only">Toggle theme</span>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem title="Set light mode" className="text-primary-foreground bg-primary" onClick={() => setThemeInternal("light")}>
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem title="Set dark mode" className="text-primary-foreground bg-primary"  onClick={() => setThemeInternal("dark")}>
                    Dark
                </DropdownMenuItem>
                <DropdownMenuItem title="Use system settings" className="text-primary-foreground bg-primary"  onClick={() => setThemeInternal("system")}>
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
