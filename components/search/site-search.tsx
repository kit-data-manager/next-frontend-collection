"use client";

import React from "react";
import {buildFacetConfigFromConfig, buildSearchOptionsFromConfig} from "@/lib/config-helper"
import ElasticsearchAPIConnector from "@elastic/search-ui-elasticsearch-connector";
import "@elastic/react-search-ui-views/lib/styles/styles.css";
import ElasticSearch from "@/app/base-repo/components/Search/Search";

export default function SiteSearch() {

    const searchOptions = buildSearchOptionsFromConfig()
    const facetsOptions = buildFacetConfigFromConfig()
    const searchUrl: string = (process.env.NEXT_PUBLIC_SEARCH_BASE_URL ? process.env.NEXT_PUBLIC_SEARCH_BASE_URL : "");
    const connector = new ElasticsearchAPIConnector({
        host: searchUrl,
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
    }
    //TODO Use alternate ElasticSearch with MyLayout
    return (
            <div className="mt-6 flow-root">
                <div className="block min-w-full align-middle">
                    <ElasticSearch config={config} />
                </div>
            </div>
    )
}
