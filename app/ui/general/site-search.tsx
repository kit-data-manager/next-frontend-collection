"use client";

import React from "react";
import {
    buildFacetConfigFromConfig,
    buildSearchOptionsFromConfig,
    buildSortOptionsFromConfig,
    getFacetFields
} from "../../lib/config-helper"
import ElasticsearchAPIConnector from "@elastic/search-ui-elasticsearch-connector";
import {
    Layout
} from "@elastic/react-search-ui-views";
import {
    ErrorBoundary,
    Facet,
    SearchProvider,
    SearchBox,
    Results,
    PagingInfo,
    ResultsPerPage,
    Paging,
    Sorting,
    WithSearch
} from "@elastic/react-search-ui";
import { memo } from 'react'

import MyBooleanFacet from "@/app/ui/general/MyBooleanFacet";
import DataCardResultView from "@/app/ui/search/DataCardResultView";
import "@elastic/react-search-ui-views/lib/styles/styles.css";
import MyLayout from "@/app/ui/general/MyLayout";

export default function SiteSearch() {

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
    }

  //  const combinedConfig = useNextRouting(config, "http://localhost:3000");
    return (
            <div className="mt-6 flow-root">
                <div className="block min-w-full align-middle">
                    <Search config={config} />
                </div>
            </div>
    )
}

const Search = memo(({ config }) => {
    return (
        <SearchProvider config={config}>
            <WithSearch mapContextToProps={({ wasSearched }) => ({ wasSearched })}>
                {({ wasSearched }) => {
                    return (
                        <div className={"App"}>
                            <ErrorBoundary>
                                <MyLayout
                                    header={<SearchBox autocompleteSuggestions={true}/>}
                                    sideContent={
                                        <div>
                                            {wasSearched && (
                                                <Sorting
                                                    label={"Sort by"}
                                                    sortOptions={buildSortOptionsFromConfig()}
                                                />
                                            )}
                                            {getFacetFields().map(field => (
                                                <Facet key={field.key} field={field.key} label={field.label?field.label:field.key.substring(0,20)} view={field.type === "boolean" ? MyBooleanFacet : undefined}/>
                                            ))
                                            }
                                        </div>
                                    }
                                    bodyContent={
                                        <Results
                                            resultView={DataCardResultView}
                                            shouldTrackClickThrough={true}
                                        />
                                    }
                                    bodyHeader={
                                        <React.Fragment>
                                            {wasSearched && <PagingInfo />}
                                            {wasSearched && <ResultsPerPage />}
                                        </React.Fragment>
                                    }
                                    bodyFooter={<Paging />}
                                />
                            </ErrorBoundary>
                        </div>
                    );
                }}
            </WithSearch>
        </SearchProvider>
    );
})
