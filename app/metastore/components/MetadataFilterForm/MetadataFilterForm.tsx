'use client';

import {CircleX, Filter} from "lucide-react"

import {Button} from "@/components/ui/button";
import React, {useEffect, useState} from "react";
import {useSession} from "next-auth/react";

import {MetadataFilterForm} from "@/app/metastore/components/MetadataFilterForm/MetadataFilterForm.d";
import {fetchMetadataRecords} from "@/lib/metastore/client-data";
import {filterMetadata} from "@/app/metastore/components/MetadataFilterForm/filter-form-actions";

export type SchemaEntry = {
    schemaId: string;        // main label
    schemaTitle: string;    // optional smaller text
};

export default function FilterMetadataForm({filter}: {
    filter: MetadataFilterForm;
}) {
    const formRef = React.useRef<HTMLFormElement>(null);
    const { data, status } = useSession();
    const basePath: string = (process.env.NEXT_PUBLIC_BASE_PATH ? process.env.NEXT_PUBLIC_BASE_PATH : "");
    const [isLoading, setLoading] = useState(true)
    const [schemaList, setSchemaList] = useState([] as SchemaEntry[]);

    const doFilterMetadata = filterMetadata.bind(null);
    const doResetForm = () => {
        formRef.current?.reset();
        window.document.location = `${basePath}/metastore/metadata`;
    };

    //const isAdmin = !!(data && data?.user.groups.includes("ROLE_ADMINISTRATOR"));

    useEffect(() => {
        setLoading(true);
        fetchMetadataRecords("schema",0, 100,undefined, filter.sort, data?.accessToken).then(async (res) => {
            const schemaList:SchemaEntry[] = [];
            res.resources.map((res) => {
                schemaList.push({schemaId: res.id, schemaTitle: res.titles[0].value});
            });
            setSchemaList(schemaList);
        }).then(() => {
            setLoading(false);
        }).catch(error => {
            console.log(`Failed to fetch schema list`, error)
            setLoading(false);
        })
    }, [data?.accessToken]);

    return (
        <div>
        <form action={doFilterMetadata} ref={formRef}>
            <div className="rounded-md">
                <fieldset className="mb-4">
                    <legend className="mb-2 block text-sm font-medium">
                        SchemaId
                    </legend>
                    <div className="rounded-md w-full border py-3">
                        <div className="ml-4">
                            {schemaList.map(key => {
                                return (
                                    <div key={key.schemaId} className="flex w-auto items-center">
                                        <input
                                            id={key.schemaId.toLowerCase()}
                                            name="schemaId"
                                            type="radio"
                                            value={key.schemaId}
                                            defaultChecked={filter.schemaId === key.schemaId}
                                            className="h-4 w-4 cursor-pointer focus:ring-2"
                                        />
                                        <label
                                            htmlFor={key.schemaId.toLowerCase()}
                                            title={key.schemaTitle}
                                            className="ml-2 flex cursor-pointer items-center gap-1.5  px-3 py-1.5 text-xs font-medium"
                                        >
                                            {key.schemaId}
                                        </label>
                                    </div>)
                            })}
                        </div>
                    </div>
                </fieldset>

            </div>
            <Button type="submit" variant="outline" className={"flex w-full mt-4"}><Filter className="h-5 w-5 me-2"/> Filter</Button>
        </form>
        <Button type="reset" variant="outline" className={"flex w-full mt-4"} onClick={() => doResetForm()}><CircleX className="h-5 w-5 me-2"/> Clear</Button>
    </div>
);
}
