import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import {DataResourcesSearchParamsPromise} from "@/lib/definitions";
import SectionCaption from "@/components/SectionCaption/SectionCaption";
import {ToastContainer} from "react-toastify";
import React from "react";
import {MappingListing} from "@/app/mapping/components/MappingListing/MappingListing";

export default async function Page({searchParams}: {
    searchParams?: DataResourcesSearchParamsPromise;
}) {
   // const params: DataResourcesSearchParams | undefined = await searchParams;

   /* const page: number = valueOrDefault(params, "page", 0);
    const size: number = valueOrDefault(params, "size", 10);
    const sort:string  = valueOrDefault(params, "sort", "title,desc");
    const filter: FilterForm = {} as FilterForm;
*/
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    {label: 'Overview', href: '/mapping'},
                    {
                        label: 'Execute Mappings',
                        href: `/mapping/map`,
                        active: true,
                    },
                ]}
            />
            <SectionCaption caption={"Execute Mappings"}/>
            <div className="flex w-full">
                    <MappingListing/>
            </div>
            <ToastContainer/>

        </main>
    );
}



