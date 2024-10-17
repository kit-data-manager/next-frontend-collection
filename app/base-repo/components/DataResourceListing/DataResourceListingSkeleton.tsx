import React from "react"
import 'react-loading-skeleton/dist/skeleton.css'
import DataResourceCardSkeleton from "@/app/base-repo/components/DataResourceCard/DataResourceCardSkeleton";

export function DataResourceListingSkeleton({...props}) {
    let count = props.count ? props.count : 10;
    let elems = Array.from(Array(count).keys())

    return (
        <div className="block min-w-full" {...props}>
            <div className="rounded-lg ml-2">
                    {elems.map((elem: number, i: number) => {
                        return (
                            <DataResourceCardSkeleton key={i} {...props}/>
                        )
                    })}
            </div>
        </div>
    )
}

export default DataResourceListingSkeleton
