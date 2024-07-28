'use client';

import Link from "next/link";
import clsx from "clsx";

export default function ConfirmCancelComponent({confirmLabel, cancelLabel, confirmCallback, cancelHref, confirm=false}:
                                                   {
                                                       confirmLabel: string,
                                                       cancelLabel: string,
                                                       confirmCallback: any,
                                                       cancelHref: string,
                                                       confirm: boolean
                                                   }) {
    return(
        <>
            <div className="container py-10 px-10 sl-7 mx-0 min-w-full flex flex-col items-center">
                <div className="space-x-4">
                    <Link id="cancelButton"
                          href={cancelHref}
                          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        {cancelLabel}
                    </Link>
                    <button id="confirmButton"
                            onClick={confirmCallback}
                            className={clsx('bg-blue-500 hover:bg-blue-700 text-white font-bold px-5 py-[7px] rounded',
                                { 'opacity-50 cursor-not-allowed': !confirm})}
                                >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </>
    )
}
