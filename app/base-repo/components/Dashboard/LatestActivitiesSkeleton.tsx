import React from "react"
import 'react-loading-skeleton/dist/skeleton.css'
import {lusitana} from "@/components/fonts";

export function LatestActivitiesSkeleton(props:any){
    let elems = Array.from(Array(10).keys())
    return (
        <div className="px-6">
            <div
                className={`${lusitana.className} flex flex-row items-center justify-between py-4 gap-2 border-t border-b p-2 animate-pulse`}>
                <div className="flex gap-2 items-center">
                    <a className="font-bold text-l animate-pulse">Loading...</a>
                </div>
            </div>
   </div>
    )
}

export default LatestActivitiesSkeleton
