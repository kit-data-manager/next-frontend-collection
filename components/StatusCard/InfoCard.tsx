"use client";

import {Icon} from "@iconify-icon/react";
import {Card} from "@/components/ui/card";

export function InfoCard({icon, text, value}: {
    icon: string;
    text: string;
    value: string;
}) {
    return (
        <Card className="w-full max-w-xs bg-card shadow-md rounded-lg overflow-hidden flex">
            {/* Icon section */}
            <div className="flex items-center justify-center bg-card brightness-150 w-1/3 h-full p-3">
                <Icon icon={icon} color={"bg-card"} className={"h-12 w-12 mr-2"} width={"42"} height={"42"}/>
            </div>

            {/* Text section */}
            <div className="flex-1 p-4 flex flex-col justify-center">
                <div className="text-xl font-semibold text-card-500">{value}</div>
                <div className="text-sm text-gray-500">{text}</div>
            </div>
        </Card>
    );
}
