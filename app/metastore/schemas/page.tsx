import {CirclePlus} from "lucide-react"
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import Link from "next/link";
import {DataResourcesSearchParams, DataResourcesSearchParamsPromise} from "@/lib/definitions";
import {valueOrDefault} from "@/lib/general/search-param-helper";
import SectionCaption from "@/components/SectionCaption/SectionCaption";
import {Button} from "@/components/ui/button";
import {SortResourceBox} from "@/app/base-repo/components/SortResourceBox/SortResourceBox";
import {PageSizeBox} from "@/components/PageSizeBox/PageSizeBox";
import {getServerSession, Session} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import SchemaListing from "@/app/metastore/components/SchemaListing/SchemaListing";
import {MetadataFilterForm} from "@/app/metastore/components/MetadataFilterForm/MetadataFilterForm.d";

export default async function Page({searchParams}: {
    searchParams?: DataResourcesSearchParamsPromise;
}) {

    const params:DataResourcesSearchParams | undefined = await searchParams;

    const page: number = valueOrDefault(params, "page", 0);
    const size: number = valueOrDefault(params, "size", 10);
    const sort:string = valueOrDefault(params, "sort", "lastUpdate,desc");
    let session:Session | undefined = await getServerSession(authOptions) as Session;

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    {label: 'Overview', href: '/metastore'},
                    {
                        label: 'Schemas',
                        href: `/metastore/schemas`,
                        active: true,
                    },
                ]}
            />
            <SectionCaption caption={"Schemas"}/>

            <div className="flex columns-2">
                  <div className="lg:initial w-full">
                    <div className="p-4 grid grid-cols-2">
                        <div className="mr-4 w-48 justify-items-start">
                            <Button asChild variant="outline">
                                {session ? (
                                    <Link
                                        className="items-center disabled w-full mb-4"
                                        href='/metastore/schemas/create'>
                                        <CirclePlus className="h-5 w-5 me-2"/> Create Schema
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
                    <SchemaListing page={page} size={size} sort={sort}/>
                </div>
            </div>
        </main>
    );
}



