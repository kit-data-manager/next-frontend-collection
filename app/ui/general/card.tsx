import {clsx} from "clsx";

export function Card({title, subtitle, icon, status, visitRef, detailsRef}: {
    title: string;
    subtitle?: string;
    status: number;
    icon?: any;
    visitRef?: string;
    detailsRef?: string;
}) {
    if(!subtitle){
        subtitle = "EMPTY"
    }

    let CardIcon;

    if (!icon) {
        if (status > 0) {
            CardIcon = <svg className="w-6 h-6 fill-current text-green-700" xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor">
                <path fillRule="evenodd"
                      d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                      clipRule="evenodd"/>
            </svg>
        } else if (status < 0) {
            CardIcon = <svg className="w-6 h-6 fill-current text-red-700" xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor">
                <path fillRule="evenodd"
                      d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z"
                      clipRule="evenodd"/>
            </svg>
        } else { //status == 0
            CardIcon = <svg className="w-6 h-6 fill-current text-gray-700" xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor">
                <path fillRule="evenodd"
                      d="M15 9 A 1 1 90 1 1 15 11 H 3 a 1 1 90 1 1 0 -2z"
                      clipRule="evenodd"/>
            </svg>
        }
    } else {
        CardIcon = icon;
    }

    return (
        <div
            className="flex flex-col justify-center items-center gap-2 border border-dashed border-gray-500 p-4 rounded-md h-24">
            <div className="flex gap-2 items-center">
                {visitRef != undefined ?
                    <a className="font-bold text-xl underline hover:text-blue-600" href={visitRef}>{title}</a>
                    :
                    <a className="font-bold text-xl" href={visitRef}>{title}</a>
                }
                {CardIcon}
            </div>
            <span className={clsx("font-semibold opacity-70 text-sm text-center", {
                "text-white": subtitle === "EMPTY"
            })}>{subtitle}</span>
            <div className="w-full flex justify-end">
                <a href={detailsRef} className={clsx("text-gray-400 text-xs font-semibold",
                    {
                        "text-white": detailsRef == undefined,
                        "hover:text-blue-600": detailsRef != undefined
                    })}
                >details...</a>
            </div>
        </div>);
}
