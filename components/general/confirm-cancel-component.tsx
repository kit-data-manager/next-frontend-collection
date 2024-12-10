'use client';

import Link from "next/link";
import clsx from "clsx";
import {useRouter} from "next/navigation";

export default function ConfirmCancelComponent({confirmLabel, cancelLabel, confirmCallback, cancelHref, confirm=false}:
                                                   {
                                                       confirmLabel: string,
                                                       cancelLabel: string,
                                                       confirmCallback: () => void,
                                                       cancelHref: string,
                                                       confirm: boolean
                                                   }) {

    const router = useRouter();

    return(
        <>
            <div className="container py-10 px-10 sl-7 mx-0 min-w-full flex flex-col items-center">
                <div className="space-x-4">
                    <button id="cancelButton"
                            onClick={() => {console.log("PUISH");
                                router.push(cancelHref);}}
                          className="bg-destructive hover:underline font-bold py-2 px-4 rounded">
                        {cancelLabel}
                    </button>
                    <button id="confirmButton"
                            onClick={confirmCallback}
                            className={clsx('bg-success hover:underline font-bold px-5 py-[7px] rounded',
                                { 'opacity-50 cursor-not-allowed': !confirm})}
                                >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </>
    )
}
