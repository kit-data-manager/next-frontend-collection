'use client';
import JsonForm from "@/app/ui/jsonform";
import {Button} from "@/app/ui/button";
import Link from "next/link";
import {PencilIcon} from "@heroicons/react/24/outline";
import ConfirmCancelComponent from "@/app/ui/general/confirm-cancel-component";
import React, {useState} from "react";
import clsx from "clsx";

export default function Editor(props) {
    const [confirm, setConfirm] = useState(false);
    const [editorReady, setEditorReady] = useState(false);
    const data = props.data ? props.data : {};
    let currentData = data;

    function dataChanged(data) {
        currentData = data;
        setConfirm(true);
    }

    function updateDataResource() {
        //send data via REST
        console.log("Putting data to server: ");
        console.log(currentData);
    }
    return (
        <>
        <div className="grid gap-6 sm:grid-rows-2 lg:grid-rows-2 ">
            <span className={clsx("bg-blue-100 font-bold px-5 py-[7px] rounded",
                {
                    'hidden': editorReady
                })
            }>Loading Editor...</span>
            <JsonForm id="DataResource" schema={props.schema} data={data} setEditorReady={setEditorReady} onChange={(d) => dataChanged(d)}></JsonForm>
            <ConfirmCancelComponent confirmLabel={"Commit"}
                                    cancelLabel={"Cancel"}
                                    confirmCallback={() => updateDataResource()}
                                    cancelHref={"/base-repo/list"}
                                    confirm = {confirm}
                                   >
            </ConfirmCancelComponent>
            <p>{editorReady}</p>
        </div>
        </>
    )
}
