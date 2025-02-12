import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import {valueOrDefault} from "@/lib/general/search-param-helper";
import SectionCaption from "@/components/SectionCaption/SectionCaption";
import {SortResourceBox} from "@/app/base-repo/components/SortResourceBox/SortResourceBox";
import {PageSizeBox} from "@/components/PageSizeBox/PageSizeBox";
import {getServerSession, Session} from "next-auth";
import {authOptions} from "@/pages/api/auth/[...nextauth]";
import {useSearchParams} from "next/navigation";
import MetadataDocumentListing from "@/app/metastore/components/MetadataDocumentListing/MetadataDocumentListing";
import {DataResourcesSearchParams, SchemaSearchParams} from "@/lib/definitions";

export default async function Page({searchParams}: {
    searchParams?: SchemaSearchParams;
}) {

    const params:DataResourcesSearchParams | undefined = await searchParams;

    const page: number = valueOrDefault(searchParams, "page", 0);
    const size: number = valueOrDefault(searchParams, "size", 10);
    const sort:string = valueOrDefault(searchParams, "sort", "lastUpdate,desc");
    let session:Session | undefined = await getServerSession(authOptions) as Session;

    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    {label: 'Overview', href: '/metastore'},
                    {
                        label: 'Metadata Documents',
                        href: `/metastore/metadata`,
                        active: true,
                    },
                ]}
            />
            <SectionCaption caption={"Metadata Documents"}/>

            <div className="flex columns-2">
                  <div className="lg:initial xl:w-full lg:w-2/3 ">
                    <div className="p-4 grid grid-cols-1">
                         <div className="justify-items-end">
                            <div className="flex space-x-2 justify-content-right">
                                <SortResourceBox/>
                                <PageSizeBox/>
                            </div>
                        </div>

                    </div>
                    <MetadataDocumentListing page={page} size={size} sort={sort}/>
                </div>
            </div>
        </main>
    );
}



