import React from "react"
import 'react-loading-skeleton/dist/skeleton.css'
import {Card} from "@/components/ui/card";
import {Icon} from "@iconify-icon/react";

export function RepositoryStatsSkeleton(props: any) {
    return (
        Array(6).fill(0).map((el, index) => (

                <Card key={"stat" + index} className="w-full max-w-xs bg-card shadow-md rounded-lg overflow-hidden flex">
                    {/* Icon section */}
                    <div
                        className="flex items-center justify-center bg-card brightness-150 w-1/3 h-full p-3 animate-pulse">
                        <Icon icon={"eos-icons:bubble-loading"} color={"bg-card"} className={"h-12 w-12 mr-2"} width={"42"} height={"42"}/>
                    </div>

                    {/* Text section */}
                    <div className="flex-1 p-4 flex flex-col justify-center">
                        <div className="text-xl font-semibold text-card-500 animate-pulse">Loading</div>
                        <div className="text-sm text-gray-500 animate-pulse">...</div>
                    </div>
                </Card>

        ))
    )
}

export default RepositoryStatsSkeleton
