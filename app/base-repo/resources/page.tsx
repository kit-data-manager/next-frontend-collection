'use client';

import {CirclePlus} from "lucide-react"
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import Link from "next/link";
import DataResourceListing from "@/app/base-repo/components/DataResourceListing/DataResourceListing";
import FilterResourceForm from "@/app/base-repo/components/FilterForm/FilterForm";
import {FilterForm} from "@/app/base-repo/components/FilterForm/FilterForm.d";
import {DataResourcesSearchParams} from "@/lib/definitions";
import {valueOrDefault} from "@/lib/searchParamHelper";
import SectionCaption from "@/components/SectionCaption/SectionCaption";
import {Button} from "@/components/ui/button";
import {useSession} from "next-auth/react";
import {SortResourceBox} from "@/app/base-repo/components/SortResourceBox/SortResourceBox";
import {PageSizeBox} from "@/components/PageSizeBox/PageSizeBox";


export default function Page({searchParams}: {
    searchParams?: DataResourcesSearchParams;
}) {

    const page: number = valueOrDefault(searchParams, "page", 0);
    const size: number = valueOrDefault(searchParams, "size", 10);
    const sort:string = valueOrDefault(searchParams, "sort", "lastUpdate,desc");
    const filter: FilterForm = {} as FilterForm;
    const { data, status } = useSession();

    filter.id = valueOrDefault(searchParams, "id", undefined);
    filter.state = valueOrDefault(searchParams, "state", undefined);
    filter.publisher = valueOrDefault(searchParams, "publisher", undefined);
    filter.publicationYear = valueOrDefault(searchParams, "publicationYear", undefined);
    filter.typeGeneral = valueOrDefault(searchParams, "typeGeneral", undefined);

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    {label: 'Overview', href: '/base-repo'},
                    {
                        label: 'Resources',
                        href: `/base-repo/resources`,
                        active: true,
                    },
                ]}
            />
            <SectionCaption caption={"Resources"}/>

            <div className="flex columns-2">
                <div className="column">
                    <div className="mb-2 h-20">
                    </div>
                    <div className="hidden lg:flex rounded-lg border items-center justify-between p-4 lg:p-6">
                        <FilterResourceForm filter={filter}/>
                    </div>
                </div>

                <div className="lg:initial xl:w-full lg:w-2/3 ">
                    <div className="p-4 grid grid-cols-2">
                        <div className="mr-4 w-48 justify-items-start">
                            <Button asChild variant="outline">
                                {data ? (
                                    <Link
                                        className="items-center disabled w-full mb-4"
                                        href='/base-repo/resources/create'>
                                        <CirclePlus className="h-5 w-5 me-2"/> Create Resource
                                    </Link>) : null}
                            </Button>
                        </div>
                        <div className="justify-items-end">
                            <div className="flex space-x-2 justify-content-right">
                                <SortResourceBox/>
                                <PageSizeBox/>
                            </div>
                        </div>

                    </div>
                    <DataResourceListing page={page} size={size} filter={filter} sort={sort}/>
                </div>
            </div>
        </main>
    );
}



