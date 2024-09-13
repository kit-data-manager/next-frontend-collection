import {lusitana} from "@/components/fonts";
import * as React from "react";

export default function SectionCaption({caption, level="h1"}: {
    caption: string;
    level?: "h1" | "h2"
}) {

    return (
        <>
            {level === "h1" &&
                <h1 className={`${lusitana.className} mb-4 text-3xl font-extrabold leading-none tracking-tight md:text-4xl`}>{caption}</h1>
            }

            {level == "h2" &&
                <h2 className={`${lusitana.className} mb-4 p-1 text-l md:text-xl border-b-2 text-primary-foreground border-primary-foreground`}>
                    {caption}
                </h2>
            }
        </>
    )
}
