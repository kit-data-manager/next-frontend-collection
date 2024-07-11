import {DataResource} from "@/app/lib/definitions";
import Pagination from "@/app/ui/general/pagination";
import {fetchDataResourcePages, fetchDataResources, loadContent} from "@/app/lib/base-repo/data";
import DataResourceDataCardWrapper from "@/app/ui/dataresources/data-resource-data-card-wrapper";
import {notFound} from "next/navigation";
import {downloadEventIdentifier, editEventIdentifier, viewEventIdentifier} from "@/app/lib/event-utils";

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

    //TODO: handle no resources

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
                    const actionEvents = [
                        viewEventIdentifier(element.id),
                        editEventIdentifier(element.id),
                        downloadEventIdentifier(element.id)
                    ];

                    return (
                        <DataResourceDataCardWrapper key={element.id} data={element} actionEvents={actionEvents}></DataResourceDataCardWrapper>
                    );
                })}
            </div>

            <div className="mt-5 flex w-full justify-center">
                <Pagination totalPages={totalPages}/>
            </div>
        </div>
    );
}
