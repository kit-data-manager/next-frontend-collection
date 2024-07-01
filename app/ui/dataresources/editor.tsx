'use client';

import JsonForm from "@/app/ui/jsonform";
import ConfirmCancelComponent from "@/app/ui/general/confirm-cancel-component";
import React, {useState} from "react";
import clsx from "clsx";
import {redirect, usePathname, useRouter} from "next/navigation";
import { revalidatePath } from 'next/cache';
import {updateInvoice} from "@/app/lib/actions";
import {updateResource} from "@/app/lib/base-repo/client";

export default function Editor(props) {
    const [confirm, setConfirm] = useState(false);
    const [editorReady, setEditorReady] = useState(false);
    const [currentData, setCurrentData] = useState(props.data ? props.data : {});
    const router = useRouter();

    const etag = props.etag;
    console.log("Using ETag ", etag);
    console.log("CurrentData Initial: ", currentData);

    function dataChanged(data) {
        console.log("ChangedData ", data);
        if(data === undefined){
            setConfirm(false);
        }else {
            setCurrentData(data);
            console.log("CurrentData now: ", currentData);
            setConfirm(true);
        }
    }

    function updateDataResource() {
        //send data via REST
        console.log("Putting data to server: ", currentData);

        const fetcher = (url:string) => fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type":"application/json",
                "If-Match": etag
            },
            body: JSON.stringify(currentData)
        }).then(function(response){
            return response.json();
        });

        fetcher("http://localhost:8081/api/v1/dataresources/" + currentData.id);
        router.push('/base-repo/resources');
        router.refresh();
    }

    return (
        <div className="grid gap-6 sm:grid-rows-2 lg:grid-rows-2 ">
            <span className={clsx("bg-blue-100 font-bold px-5 py-[7px] rounded",
                {
                    'hidden': editorReady
                })
            }>Loading Editor...</span>
            <JsonForm id="DataResource" schema={props.schema} data={currentData} setEditorReady={setEditorReady} onChange={(d) => dataChanged(d)}></JsonForm>
            <ConfirmCancelComponent confirmLabel={"Commit"}
                                    cancelLabel={"Cancel"}
                                    confirmCallback={() => updateDataResource()}
                                    cancelHref={"/base-repo/resources"}
                                    confirm = {confirm}
                                   >
            </ConfirmCancelComponent>
            <p>{editorReady}</p>
        </div>
    )
}
