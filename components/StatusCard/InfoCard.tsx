"use client";

import {Icon} from "@iconify-icon/react";
import {Card} from "@/components/ui/card";

export function InfoCard({icon, text, value}: {
    icon: string;
    text: string;
    value: string;
}) {
    return (
        <Card className="w-full rounded-md border bg-card p-2 sm:p-3 shadow-sm">
            <div className="flex items-start gap-2 sm:gap-3">
                {/* Icon */}
                <div className="flex items-center justify-center rounded-md h-8 w-8 sm:h-9 sm:w-9">
                    <Icon icon={icon} className="h-4 w-4 text-primary-foreground"/>
                </div>

                {/* Value + label */}
                <div className="flex flex-col">
                    <span className="font-semibold leading-none text-primary-foreground text-lg sm:text-xl">
                        {value}
                    </span>

                    <span className="mt-1 text-muted-foreground text-[11px] sm:text-xs">
                        {text}
                    </span>
                </div>
            </div>
        </Card>
    );
}
