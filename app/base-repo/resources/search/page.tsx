"use client";

import Breadcrumbs from '@/components/Breadcrumbs/Breadcrumbs';
import React from "react";
import {
    buildFacetConfigFromConfig,
    buildSearchOptionsFromConfig,
    buildSortOptionsFromConfig,
    getFacetFields
} from "../../../../lib/config-helper"
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

import MyBooleanFacet from "@/components/search/MyBooleanFacet";
import DataCardResultView from "@/components/search/DataCardResultView";
import { useNextRouting } from "../../../../lib/useNextRouting";
import "@elastic/react-search-ui-views/lib/styles/styles.css";

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
    }

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
            <div className="mt-6 flow-root">
                <div className="block min-w-full align-middle">
               <Search config={config} />
            </div>
            </div>
        </main>
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
                                    <Layout
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
