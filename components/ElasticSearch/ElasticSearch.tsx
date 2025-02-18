"use client";

import {
    FairDOConfig,
    FairDOElasticSearch,
    GenericResultView,
    ResultViewProps
} from "@kit-data-manager/react-fairdo-search";
import {useCallback, useMemo} from "react";
import {AtomIcon, GlobeIcon, GraduationCap, ScaleIcon} from "lucide-react";
import {tryURLPrettyPrint} from "@kit-data-manager/react-fairdo-search/dist/lib/utils";
import {RecordResultView} from "@/components/ElasticSearch/RecordResultView";

export default function ElasticSearch() {
    // First we configure the search itself. Here we defined the elastic endpoint as well as the facets.
    const searchUrl: string = (process.env.NEXT_PUBLIC_SEARCH_BASE_URL ? process.env.NEXT_PUBLIC_SEARCH_BASE_URL : "");

    const config: FairDOConfig = useMemo(() => {
        return {
            alwaysSearchOnInitialLoad: true,
            host: searchUrl,
            indices: [
                {
                    name: "baserepo",
                    facets: [
                        {
                            key: "_index",
                            label: "Index",
                            prettyPrintURLs: false // Will remove https://www.
                        },
                        {
                            key: "metadata.resourceType.typeGeneral",
                            label: "Resource Type",
                            prettyPrintURLs: false // Will remove https://www.
                        },
                        {
                            key: "metadata.publicationYear",
                            label: "Publication Year",
                            type: "date_year",
                            prettyPrintURLs: false // Will remove https://www.
                        },
                        {
                            key: "metadata.rights.schemeId",
                            label: "License",
                            prettyPrintURLs: false // Will remove https://www.
                        },
                        {
                            key: "metadata.state",
                            label: "State",
                            prettyPrintURLs: false // Will remove https://www.
                        },
                        {
                            key: "metadata.dates.value",
                            label: "Dates",
                            type: "date_year",
                            prettyPrintURLs: false // Will remove https://www.
                        }


                    ],
                    resultFields: [], // Leave empty to get all fields
                    searchFields: ["metadata.titles.value", "metadata.publisher"]
                }
            ],
            sortOptions: [{
                "field": "_score",
                "direction": "desc",
                "label": "Relevance"
            },{
                "field": "metadata.publicationYear",
                "direction": "asc",
                "label": "Publication Year"
            }
            ],
            connectionOptions: {
                headers: {
                    // Pass your authentication headers here
                }
            }
        }
    }, []) // Make sure to add all non-static dependencies here! E.g. access code

    // To display our results we have to define a result view. Since every FDOs can look very different, the different
    // field names have to be defined here. You can also define your own component for rendering results.
    /*
    imageField="locationPreview/Sample"

                parentItemPidField="hasMetadata"
                childItemPidField="isMetadataFor"
    */
    const resultView = useCallback((props: ResultViewProps) => {
        // GenericResultView is a configurable fallback component for displaying simple results
        return (
            <RecordResultView
                result={props.result}
                // ...many more options exist, use TypeScript to easily view them in your code
            />
        )
    }, [])

    return (
        <FairDOElasticSearch config={config} resultView={resultView}/>
    )
}
