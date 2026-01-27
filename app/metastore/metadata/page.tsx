import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import {
    MetadataSearchParams,
    MetadataSearchParamsPromise
} from "@/lib/definitions";
import {valueOrDefault} from "@/lib/general/search-param-helper";
import SectionCaption from "@/components/SectionCaption/SectionCaption";
import {SortResourceBox} from "@/app/base-repo/components/SortResourceBox/SortResourceBox";
import {PageSizeBox} from "@/components/PageSizeBox/PageSizeBox";
import MetadataDocumentListing from "@/app/metastore/components/MetadataDocumentListing/MetadataDocumentListing";
import {MetadataFilterForm} from "@/app/metastore/components/MetadataFilterForm/MetadataFilterForm.d";
import FilterMetadataForm from "@/app/metastore/components/MetadataFilterForm/MetadataFilterForm";

export default async function Page({searchParams}: {
    searchParams?: MetadataSearchParamsPromise;
}) {

    const params:MetadataSearchParams | undefined = await searchParams;

    const page: number = valueOrDefault(params, "page", 0);
    const size: number = valueOrDefault(params, "size", 10);
    const sort:string = valueOrDefault(params, "sort", "lastUpdate,desc");
    const filter: MetadataFilterForm = {} as MetadataFilterForm;

    filter.schemaId = valueOrDefault(params, "schemaId", undefined);

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
                    <div className="column">
                        <div className="mb-2 h-20">
                        </div>
                        <div className="hidden lg:flex rounded-lg border items-center justify-between p-4 lg:p-6">
                            <FilterMetadataForm filter={filter}/>
                        </div>
                    </div>

                  <div className="lg:initial w-full">
                    <div className="p-4 grid grid-cols-1">
                         <div className="justify-items-end">
                            <div className="flex space-x-2 justify-content-right">
                                <SortResourceBox/>
                                <PageSizeBox/>
                            </div>
                        </div>

                    </div>
                    <MetadataDocumentListing page={page} filter={filter} size={size} sort={sort}/>
                </div>
            </div>
        </main>
    );
}



