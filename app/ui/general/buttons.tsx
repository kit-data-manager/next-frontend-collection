'use client';

import Link from "next/link";
import {PencilIcon} from "@heroicons/react/24/outline";


export function CommitDataResource({ id }: { id: string }) {
    return (
        <Link
            href={`/dashboard/dataresources/${id}/edit`}
            className="flex items-center rounded-md border p-2 hover:bg-blue-100 text-sm w-auto">
            <PencilIcon className="w-5" /> <span>Save</span>
        </Link>
    );
}

export function UpdateDataResource({ id }: { id: string }) {
    return (
        <Link
            href={`/dashboard/dataresources/${id}/edit`}
            className="rounded-md border p-2 hover:bg-gray-100"
        >
            <PencilIcon className="w-5" />
        </Link>
    );
}
