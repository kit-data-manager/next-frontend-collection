import React from "react"
import 'react-loading-skeleton/dist/skeleton.css'
import {Icon} from "@iconify-icon/react";

export function ActivityListSkeleton(props:any){
    const activities:Array<number> = [1,2,3,4,5,6];
    return (
        <div className="w-full max-w-3xl mx-auto rounded-lg border bg-card text-card-foreground shadow-sm overflow-y-auto h-[400px]">
            {activities.map((activity, index) => (
                <div key={index} className="flex items-start border-b last:border-0">
                    {/* Icon Section */}
                    <div className="w-1/5 flex items-center bg-card p-3 brightness-150 justify-center h-full">
                        <Icon icon={"tdesign:loading"} width={"30"} height={"30"} className={"mb-4"} />
                    </div>

                    {/* Title and Subtitle Section */}
                    <div className="w-2/5 pl-4 flex-1 p-4 flex flex-col justify-center">
                        <div className="text-l font-semibold text-card-800 mt-2">Loading</div>
                        <div className="text-sm text-gray-600 mb-2">...</div>
                    </div>

                    {/* Date Section */}
                    <div className="w-2/5 text-right text-sm text-gray-500 m-2">

                    </div>
                </div>
            ))}
        </div>
    )
}

export default ActivityListSkeleton
