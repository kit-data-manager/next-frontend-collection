import {DataResource} from "@/lib/definitions";
import Pagination from "@/components/general/pagination";
import {fetchDataResourcePages, fetchDataResources, loadContent} from "@/lib/base-repo/data";
import DataResourceCard from "@/app/base-repo/components/DataResourceCard/DataResourceCard";
import {notFound} from "next/navigation";
import {downloadEventIdentifier, editEventIdentifier, viewEventIdentifier} from "@/lib/event-utils";
import {FilterForm} from "@/app/base-repo/components/FilterForm/FilterForm.d";

export default async function DataResourceListing({page,size, filter}: {
    page: number;
    size: number;
    filter: FilterForm;
}) {


    //load resources and total pages
    const [resources, totalPages] = await Promise.all([
        fetchDataResources(page, size, filter),
        fetchDataResourcePages(size)
    ]);


    if(!resources || resources.length === 0){
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
                        <DataResourceCard key={element.id} data={element} actionEvents={actionEvents}></DataResourceCard>
                    );
                })}

            </div>

            <div className="mt-5 flex w-full justify-center">
                <Pagination totalPages={totalPages}/>
            </div>
        </div>
    );
}
