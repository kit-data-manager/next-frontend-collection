'use client';

import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import {DataResourcesSearchParams} from "@/lib/definitions";
import SectionCaption from "@/components/SectionCaption/SectionCaption";
import {useSession} from "next-auth/react";
import FilterResourceForm from "@/app/base-repo/components/FilterForm/FilterForm";
import {Button} from "@/components/ui/button";
import Link from "next/link";
import {CirclePlus} from "lucide-react";
import {SortResourceBox} from "@/app/base-repo/components/SortResourceBox/SortResourceBox";
import {PageSizeBox} from "@/components/PageSizeBox/PageSizeBox";
import DataResourceListing from "@/app/base-repo/components/DataResourceListing/DataResourceListing";
import MappingListing from "@/app/mapping/components/MappingListing/MappingListing";
import {valueOrDefault} from "@/lib/searchParamHelper";
import {FilterForm} from "@/app/base-repo/components/FilterForm/FilterForm.d";

export default function Page({searchParams}: {
    searchParams?: DataResourcesSearchParams;
}) {
    const page: number = valueOrDefault(searchParams, "page", 0);
    const size: number = valueOrDefault(searchParams, "size", 10);
    const sort:string = valueOrDefault(searchParams, "sort", "title,desc");
    const filter: FilterForm = {} as FilterForm;

    const { data, status } = useSession();

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
                    <MappingListing page={page} size={size} filter={filter} sort={sort}/>
            </div>
        </main>
    );
}



