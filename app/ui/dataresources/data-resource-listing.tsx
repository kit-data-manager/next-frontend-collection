import {DataResource} from "@/app/lib/definitions";
import Pagination from "@/app/ui/general/pagination";
import {fetchDataResourcePages, fetchDataResources, loadContent} from "@/app/lib/base-repo/data";
import DataResourceDataCardWrapper from "@/app/ui/dataresources/data-resource-data-card-wrapper";
import {notFound} from "next/navigation";

export default async function DataResourceListing({page,size}: {
    page: number;
    size: number;
}) {

    //load resources and total pages
    const [resources, totalPages] = await Promise.all([
        fetchDataResources(page, size),
        fetchDataResourcePages(size)
    ]);

    if(!resources){
        notFound();
    }

    //load content for all resources
    const resourcesWithContent = resources.map((element:DataResource) => {
        return loadContent(element);
    });

    //wait for content load promises
    const finalResources:DataResource[] = await Promise.all(resourcesWithContent);

    return (
        <div className="block min-w-full">
            <div className="rounded-lg bg-gray-50 p-2 md:pt-0">
                {finalResources.map((element:DataResource, i:number) => {
                    return (
                        <DataResourceDataCardWrapper key={element.id} data={element}></DataResourceDataCardWrapper>
                    );
                })}
            </div>

            <div className="mt-5 flex w-full justify-center">
                <Pagination totalPages={totalPages}/>
            </div>
        </div>
    );
}
