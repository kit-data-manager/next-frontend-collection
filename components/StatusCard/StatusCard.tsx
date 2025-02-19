import {clsx} from "clsx";
import {lusitana} from "@/components/fonts";
import {CardStatus} from "./StatusCard.d"
import {ReactElement} from "react";
import Link from "next/link";

export function StatusCard({cardStatus}: {
   cardStatus: CardStatus
}) {
    let CardIcon:ReactElement;

    if (!cardStatus.icon) {
        if (cardStatus.status > 0) {
            CardIcon = <svg className="w-6 h-6 fill-current text-success" xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor">
                <path fillRule="evenodd"
                      d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                      clipRule="evenodd"/>
            </svg>
        } else if (cardStatus.status < 0) {
            CardIcon = <svg className="w-6 h-6 fill-current text-error" xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor">
                <path fillRule="evenodd"
                      d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z"
                      clipRule="evenodd"/>
            </svg>
        } else { //status == 0
            CardIcon = <svg className="w-6 h-6 fill-current text-info" xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor">
                <path fillRule="evenodd"
                      d="M15 9 A 1 1 90 1 1 15 11 H 3 a 1 1 90 1 1 0 -2z"
                      clipRule="evenodd"/>
            </svg>
        }
    } else {
        CardIcon = cardStatus.icon;
    }

    return (
        <div
            className={`${lusitana.className} flex flex-col bg-card text-card-foreground border shadow justify-start items-center gap-2 p-4 rounded-md`}>
            <div className="flex gap-2 items-center">
                {cardStatus.visitRef != undefined && cardStatus.status > 0 ?
                    <Link className="font-bold text-l underline pointer-events-auto hover:underline" href={cardStatus.visitRef}>{cardStatus.title}</Link>
                    :
                    <p className="font-bold text-l pointer-events-none">{cardStatus.title}</p>
                }
                {CardIcon}
            </div>
            <span className={clsx("font-semibold opacity-70 text-sm text-center", {
                "text-white": !cardStatus.subtitle
            })}>{cardStatus.subtitle}</span>
            {cardStatus.detailsRef ?
                <div className="w-full flex justify-end">
                    <Link href={cardStatus.detailsRef} target={"_self"}
                       className="text-xs font-semibold pointer-events-auto hover:underline">details...</Link>
                </div>
                :
                <div className="w-full flex justify-end">
                    <span className="text-xs font-semibold text-card pointer-events-none">.</span>
                </div>}
        </div>);
}
