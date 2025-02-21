import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import {
    DataResourcesSearchParams,
    DataResourcesSearchParamsPromise
} from "@/lib/definitions";
import {valueOrDefault} from "@/lib/general/search-param-helper";
import SectionCaption from "@/components/SectionCaption/SectionCaption";
import {SortResourceBox} from "@/app/base-repo/components/SortResourceBox/SortResourceBox";
import {PageSizeBox} from "@/components/PageSizeBox/PageSizeBox";
import MetadataDocumentListing from "@/app/metastore/components/MetadataDocumentListing/MetadataDocumentListing";

export default async function Page({searchParams}: {
    searchParams?: DataResourcesSearchParamsPromise;
}) {

    const params:DataResourcesSearchParams | undefined = await searchParams;

    const page: number = valueOrDefault(params, "page", 0);
    const size: number = valueOrDefault(params, "size", 10);
    const sort:string = valueOrDefault(params, "sort", "lastUpdate,desc");

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
                  <div className="lg:initial w-full">
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



