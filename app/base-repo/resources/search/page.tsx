"use client";

import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import React from "react";
import {buildFacetConfigFromConfig, buildSearchOptionsFromConfig} from "@/lib/config-helper"
import ElasticsearchAPIConnector from "@elastic/search-ui-elasticsearch-connector";
import "@elastic/react-search-ui-views/lib/styles/styles.css";
import SectionCaption from "@/components/SectionCaption/SectionCaption";
import ElasticSearch from "@/app/base-repo/components/Search/Search";

export default function Page() {

    const searchOptions = buildSearchOptionsFromConfig()
    const facetsOptions = buildFacetConfigFromConfig()

    const connector = new ElasticsearchAPIConnector({
        host: "http://localhost:8081/api/v1",
        index: searchOptions.index_names.join(",")
    });

    const config= {
        debug: false,
        alwaysSearchOnInitialLoad: false,
        searchQuery: {
            search_fields: searchOptions.search_fields,
            result_fields: searchOptions.result_fields,
            facets: facetsOptions
        },
        apiConnector: connector
    };

   // const combinedConfig = useNextRouting(config, "http://localhost:3000");
    return (
        <main>
            <Breadcrumbs
                breadcrumbs={[
                    {label: 'Overview', href: '/base-repo'},
                    {label: 'Resources', href: '/base-repo/resources'},
                    {
                        label: `Search`,
                        href: `/base-repo/resources/search`,
                        active: true,
                    },
                ]}
            />
            <SectionCaption caption={"Search"}/>

            <div className="flow-root">
                <div className="block min-w-full align-middle">
               <ElasticSearch config={config}/>
            </div>
            </div>
        </main>
    )
}
