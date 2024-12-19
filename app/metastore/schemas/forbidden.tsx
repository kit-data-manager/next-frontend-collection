import Link from 'next/link';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

export default function Forbidden() {
    return (
        <main className="flex h-full flex-col items-center justify-center gap-2">
            <ExclamationTriangleIcon className="w-10 text-gray-400"/>
            <h2 className="text-xl font-semibold">403 Forbidden</h2>
            <p>You are not authorized to access the resource.</p>
            <Link
                href="/metastore/schemas"
                className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
            >
                Go Back
            </Link>
        </main>
    );
}
