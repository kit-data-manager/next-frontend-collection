"use client";

import {
    SearchConfig,
    ReactSearchComponent,
    ResultViewProps, prettyPrintURL,
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
                            label: "Index"
                        },
                        {
                            key: "metadata.resourceType.typeGeneral.keyword",
                            label: "Resource Type"
                        },
                        {
                            key: "metadata.publicationYear.keyword",
                            label: "Publication Year",
                            type: "date_year"
                        },
                        {
                            key: "metadata.rights.schemeId.keyword",
                            label: "License",
                            singleValueMapper: v => prettyPrintURL(v + "")
                        },
                        {
                            key: "metadata.state.keyword",
                            label: "State"
                        },
                        {
                            key: "lastUpdate.keyword",
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
