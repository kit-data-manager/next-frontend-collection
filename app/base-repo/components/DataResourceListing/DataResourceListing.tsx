import {DataResource} from "@/lib/definitions";
import {fetchDataResourcePages, fetchDataResources, loadContent} from "@/lib/base-repo/data";
import DataResourceCard from "@/app/base-repo/components/DataResourceCard/DataResourceCard";
import {notFound} from "next/navigation";
import {downloadEventIdentifier, editEventIdentifier, viewEventIdentifier} from "@/lib/event-utils";
import {FilterForm} from "@/app/base-repo/components/FilterForm/FilterForm.d";
import Pagination from "@/components/general/Pagination";

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

const typedRes = resources as Array<DataResource>

    if(!typedRes || typedRes.length === 0){
        notFound();
    }
    //TODO: handle no resources

    //load content for all resources
    const resourcesWithContent = typedRes.map((element:DataResource) => {
        return loadContent(element);
    });

    //wait for content load promises
    const finalResources:DataResource[] = await Promise.all(resourcesWithContent);

    return (
        <div>
            <div className="rounded-lg p-2 md:pt-0">
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
                <Pagination totalPages={totalPages as number}/>
            </div>
        </div>
    );
}
