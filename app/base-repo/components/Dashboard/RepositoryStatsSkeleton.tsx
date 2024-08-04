import React from "react"
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
export function LatestActivitiesSkeleton(props){
    let elems = Array.from(Array(10).keys())

    return(
        <div className="block col-span-2 min-w-full">
            <div className="rounded-lg p-2 row-gap-4 md:pt-0">
                <SkeletonTheme baseColor="var(--muted)" highlightColor="var(--muted-foreground)" >
                    {elems.map((elem:number, i:number) => {
                        return (
                            <Skeleton key={i} className={"mt-5"} width={(Math.floor(Math.random() * (100 - 70) ) + 70) + "%"} {...props}/>
                        )
                    })}
                </SkeletonTheme>
            </div>
        </div>
    )
}

export default LatestActivitiesSkeleton
