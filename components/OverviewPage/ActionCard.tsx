"use client";

import Link from "next/link";
import {Icon} from "@iconify-icon/react";
import React from "react";

export type ActionCardProps = {
    icon: "add" | "list" | "upload" | "search";  // The icon name, e.g., plus
    title: string;        // main label
    subtitle?: string;    // optional smaller text
    href: string; // ref
    className?: string;
    requiresAuth: boolean;
};

const iconMap = {
    add: "grommet-icons:new",
    list: "grommet-icons:unordered-list",
    upload: "grommet-icons:upload",
    search: "grommet-icons:search"
};

export function ActionCard({ icon, title, subtitle, href, className }: ActionCardProps) {
    const iconName = iconMap[icon];

    return (
        <Link href={href || "#"}>
            <div
                className={`flex items-center gap-4 rounded-md border bg-accent p-4 shadow-sm hover:shadow-md 
                hover:scale-105 transition-all duration-150 ${className}`}>

            {/* Icon */}
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-muted flex-shrink-0">
                <Icon icon={iconName} className="h-4 w-4 text-foreground" />
            </div>

            {/* Text */}
            <div className="flex flex-col justify-center">
                <span className="text-base font-semibold text-foreground">{title}</span>
                {subtitle && <span className="text-sm text-muted-foreground">{subtitle}</span>}
            </div>
        </div>
        </Link>
    );
}
