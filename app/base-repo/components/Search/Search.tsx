import React, {memo} from "react";
import {
    ErrorBoundary,
    Facet,
    Paging,
    PagingInfo,
    Results,
    ResultsPerPage,
    SearchBox,
    SearchProvider,
    Sorting,
    WithSearch
} from "@elastic/react-search-ui";
import {Layout} from "@elastic/react-search-ui-views";
import {buildSortOptionsFromConfig, getFacetFields} from "@/lib/config-helper";
import MyBooleanFacet from "@/components/search/MyBooleanFacet";
import DataCardResultView from "@/components/search/DataCardResultView";

function ElasticSearch(config){

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
                                    <>
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
                                    </>
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
};

export default memo(ElasticSearch);

