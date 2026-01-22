import * as React from 'react';
import Breadcrumbs from "@/components/Breadcrumbs/Breadcrumbs";
import ElasticSearch from "@/components/ElasticSearch/ElasticSearch";
import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert";
import {SearchX} from "lucide-react";
import SectionCaption from "@/components/SectionCaption/SectionCaption";

export default async function Page() {
    const searchEnabled = process.env.NEXT_PUBLIC_SEARCH_BASE_URL != undefined;

    return (
        <main className="flex h-full flex-col">
            <Breadcrumbs
                breadcrumbs={[
                    {label: "Site Search", href: '/search', active: true},
                ]}
            />
            {searchEnabled ?
                <>
                    <SectionCaption caption={"Site Search"}/>
                    <ElasticSearch/>
                </> :
                <div
                    className="flex justify-center gap-6 rounded-lg px-6 pt-10 pb-10 md:h-3/5 lg:px-20 grid-cols-3">

                    <Alert className={"text-warn"}>
                        <SearchX className="h-4 w-4"/>
                        <AlertTitle>Search Not Available</AlertTitle>
                        <AlertDescription>
                            Search is disabled for that instance. Please navigate directly to one of the configured services.
                        </AlertDescription>
                    </Alert>
                </div>
            }
        </main>
    );
}
