"use client";

import React from "react";
import "@elastic/react-search-ui-views/lib/styles/styles.css";
import ElasticSearch from "@/components/ElasticSearch/ElasticSearch";

export default function SiteSearch() {
    return (
            <div className="mt-6 flow-root">
                <div className="block min-w-full align-middle">
                    <ElasticSearch/>
                </div>
            </div>
    )
}
