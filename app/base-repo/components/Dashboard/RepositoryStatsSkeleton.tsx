import React from "react"
import 'react-loading-skeleton/dist/skeleton.css'
import {lusitana} from "@/components/fonts";
export function LatestActivitiesSkeleton(props:any) {
    return (

        Array(6).fill(0).map((el, index) => (
            <div key={index}>
                <div
                    className={`${lusitana.className} flex flex-col bg-card text-card-foreground border shadow justify-center items-center gap-2 p-4 rounded-md animate-pulse`}>
                    <div className="flex gap-2 items-center">
                        <a className="font-bold text-l animate-pulse">Loading...</a>
                    </div>

                 </div>
            </div>
        ))
    )
}
 export default LatestActivitiesSkeleton
