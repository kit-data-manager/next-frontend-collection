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
                            key: "publisher.keyword",
                            label: "Publisher",
                            prettyPrintURLs: false // Will remove https://www.
                        },
                        {
                            key: "rights.keyword",
                            label: "License",
                            prettyPrintURLs: true
                        }
                    ],
                    resultFields: [], // Leave empty to get all fields
                    searchFields: ["publisher", "titles", "description"]
                }
            ],
            sortOptions: [
                { field: "_score", direction: "desc", label: "Relevance" },
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
    const resultView = useCallback((props: ResultViewProps) => {
        // GenericResultView is a configurable fallback component for displaying simple results
        return (
            <GenericResultView
                result={props.result}

                pidField="id"
                titleField="publisher"
                creationDateField="dateCreatedRfc3339"
                imageField="locationPreview/Sample"

                parentItemPidField="hasMetadata"
                childItemPidField="isMetadataFor"

                tags={[
                    {
                        icon: <GraduationCap />,
                        label: "Resource Type",
                        field: "resourceType"
                    },
                    {
                        icon: <GlobeIcon />,
                        field: "hadPrimarySource",
                        singleValueMapper: tryURLPrettyPrint
                    },
                    {
                        icon: <ScaleIcon />,
                        field: "licenseURL",
                        singleValueMapper: value => value + " can be mapped" // Can use simple string mapping
                    },
                    {
                        icon: <AtomIcon />,
                        field: "Compound",
                        singleValueMapper: value => <div>{value}</div> // Can pass any component as tag content
                    }
                ]}

                invertImageInDarkMode // Not recommended for colorful images
                showOpenInFairDoScope

                // ...many more options exist, use TypeScript to easily view them in your code
            />
        )
    }, [])

    return (
        <FairDOElasticSearch config={config} resultView={resultView} />
    )
}
