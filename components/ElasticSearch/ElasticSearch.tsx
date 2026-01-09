"use client";

import {
SearchConfig,
    ReactSearchComponent,
    ResultViewProps,
} from "@kit-data-manager/react-search-component";
import React, {useCallback, useMemo} from "react";
import {RecordResultView} from "@/components/ElasticSearch/RecordResultView";
import {useTheme} from "next-themes";
import {useSession} from "next-auth/react";
import Loader from "@/components/general/Loader";

export default function ElasticSearch() {
    const searchUrl: string = (process.env.NEXT_PUBLIC_SEARCH_BASE_URL ? process.env.NEXT_PUBLIC_SEARCH_BASE_URL : "");
    const {theme} = useTheme();
    const {data, status} = useSession();

    const config: SearchConfig = useMemo(() => {
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
                            prettyPrintURLs: false
                        },
                        {
                            key: "metadata.resourceType.typeGeneral",
                            label: "Resource Type",
                            prettyPrintURLs: false
                        },
                        {
                            key: "metadata.publicationYear",
                            label: "Publication Year",
                            type: "date_year",
                            prettyPrintURLs: false
                        },
                        {
                            key: "metadata.rights.schemeId",
                            label: "License",
                            prettyPrintURLs: false
                        },
                        {
                            key: "metadata.state",
                            label: "State",
                            prettyPrintURLs: false
                        },
                        {
                            key: "lastUpdate",
                            label: "Last Update",
                            type: "date_time_no_millis"
                        }
                    ],
                    resultFields: [], // Leave empty to get all fields
                    searchFields: ["metadata.titles.value", "metadata.publisher", "metadata.descriptions.description"]
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
                    "Authorization": "Bearer " + data?.accessToken
                }
            }
        }
    }, [searchUrl, data?.accessToken])

    const resultView = useCallback((props: ResultViewProps) => {
        return (
            <RecordResultView
                result={props.result}
            />
        )
    }, [])

    if (status === "loading") {
        return (<Loader/>)
    }

    return (
        <ReactSearchComponent config={config} resultView={resultView} dark={theme === "dark"}/>
    )
}
