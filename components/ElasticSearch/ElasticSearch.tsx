"use client";

import {
    SearchConfig,
    ReactSearchComponent,
    ResultViewProps
} from "@kit-data-manager/react-search-component";
import React, {useCallback, useMemo} from "react";
import {RecordResultView} from "@/components/ElasticSearch/RecordResultView";
import {useTheme} from "next-themes";
import {useSession} from "next-auth/react";
import Loader from "@/components/general/Loader";
import indices from "@/config/search/indices.json";

function enrichIndicesData(data) {
    return data.map(repo => {
        const label = repo.label;

        return {
            ...repo,
            facets: repo.facets?.map(facet =>
                facet.key === "_index"
                    ? {
                        ...facet,
                        singleValueMapper: v => label ?? v
                    }
                    : facet
            )
        };
    });
}

export default function ElasticSearch() {
    const searchUrl: string = (process.env.NEXT_PUBLIC_SEARCH_BASE_URL ? process.env.NEXT_PUBLIC_SEARCH_BASE_URL : "");
    const {theme} = useTheme();
    const {data, status} = useSession();

    const enrichedIndices = enrichIndicesData(indices);

    const config: SearchConfig = useMemo(() => {
        return {
            alwaysSearchOnInitialLoad: true,
            host: searchUrl,
            indices: enrichedIndices,
            sortOptions: [{
                "field": "_score",
                "direction": "desc",
                "label": "Relevance"
            },{
                "field": "metadata.publicationYear",
                "direction": "asc",
                "label": "Publication Year"
            },{
                "field": "metadata.lastUpdate",
                "direction": "asc",
                "label": "Last Update"
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
            <RecordResultView result={props.result}/>
        )
    }, [])

    if (status === "loading") {
        return (<Loader/>)
    }

    return (
        <ReactSearchComponent config={config} resultView={resultView} dark={theme === "dark"}/>
    )
}
