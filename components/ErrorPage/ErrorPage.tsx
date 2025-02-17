import Link from 'next/link';
import {ErrorDescription, Errors} from "@/components/ErrorPage/ErrorPage.d";
import {
    ExclamationTriangleIcon,
    FaceFrownIcon,
    NoSymbolIcon,
    QuestionMarkCircleIcon
} from "@heroicons/react/24/outline";
import React, {JSX} from "react";
import {Icon} from "@iconify-icon/react";

export default function ErrorPage(errorDescription: ErrorDescription) {
    let ICON:JSX.Element, title:string, text:string;

    switch(errorDescription.errorCode){
        case Errors.Unauthorized:{
            ICON = <ExclamationTriangleIcon className="w-10 text-gray-400"/>
            title = "401 Unauthorized";
            text = "You must be logged in to access this page.";
            break;
        }
        case Errors.Forbidden: {
            ICON = <NoSymbolIcon className="w-10 text-gray-400"/>
            title = "403 Forbidden";
            text = "You have no permission to access this page.";
            break;
        }
        case Errors.NotFound: {
            ICON = <FaceFrownIcon className="w-10 text-gray-400"/>
            title = "404 Not Found";
            text = "No resources found. Please check your filters and permissions.";
            break;
        }
        case Errors.Empty: {
            ICON =  <Icon
                          icon={"mdi:search-minus"}
                          className="h-10 w-10"/>
            title = "Nothing found";
            text = "No elements found. Please check your filters and permissions.";
            break;
        }
        default: {
            //InternalServerError or other
            ICON = <QuestionMarkCircleIcon className="w-10 text-gray-400"/>
            title = "500 Internal Server Error";
            text = "An internal server error occurred. Please try again later.";
            break;
        }
    }

    return (
        <main className="flex h-full flex-col items-center gap-2">
            {ICON}
            <h2 className="text-xl font-semibold">{title}</h2>
            <p>{text}</p>
            <Link
                href={errorDescription.backRef}
                className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
            >
                Go Back
            </Link>
        </main>
    );
}
