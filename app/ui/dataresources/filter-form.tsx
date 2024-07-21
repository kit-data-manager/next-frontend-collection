'use client';

import {CustomerField, FilterForm, InvoiceForm} from '@/app/lib/definitions';
import {
    CalendarIcon,
    LockClosedIcon,
    LockOpenIcon,
    UserCircleIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { filterResources } from '@/app/lib/actions';
import {Button} from "@/app/ui/button";

export default function FilterResourceForm({
                                            filter
                                        }: {
    filter: FilterForm;
}) {
    const doFilterResources = filterResources.bind(null);

    return (
        <form action={doFilterResources}>
            <div className="rounded-md bg-gray-50 p-4 md:p-6">
                {/* Customer Name */}
                <div className="mb-4">
                    <label htmlFor="customer" className="mb-2 block text-sm font-medium">
                        Publisher
                    </label>
                    <div className="relative">
                        <input
                            id="publisher"
                            name="publisher"
                            type="text"
                            className="peer block w-full cursor-pointer rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            defaultValue={filter.publisher}
                        >
                        </input>
                        <UserCircleIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500" />
                    </div>
                </div>

                <div className="mb-4">
                    <label htmlFor="publicationYear" className="mb-2 block text-sm font-medium">
                        Publication Year
                    </label>
                    <div className="relative mt-2 rounded-md">
                        <div className="relative">
                            <input
                                id="publicationYear"
                                name="publicationYear"
                                type="number"
                                step="1"
                                defaultValue={filter.publicationYear}
                                placeholder="2024"
                                className="peer block w-full rounded-md border border-gray-200 py-2 pl-10 text-sm outline-2 placeholder:text-gray-500"
                            />
                            <CalendarIcon className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
                        </div>
                    </div>
                </div>

                {/* Invoice Status */}
                <fieldset>
                    <legend className="mb-2 block text-sm font-medium">
                        Resource Status
                    </legend>
                    <div className="rounded-md border border-gray-200 bg-white px-[14px] py-3">
                        <div className="m-4 gap-2">
                            <div className="flex items-center">
                                <input
                                    id="volatile"
                                    name="state"
                                    type="radio"
                                    value="Volatile"
                                    defaultChecked={filter.state === 'Volatile'}
                                    className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                                />
                                <label
                                    htmlFor="volatile"
                                    className="ml-2 w-full flex cursor-pointer items-center gap-1.5 rounded-full bg-green-500  px-3 py-1.5 text-xs font-medium text-gray-600"
                                >
                                    Volatile <LockOpenIcon className="h-4 w-4" />
                                </label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    id="fixed"
                                    name="status"
                                    type="radio"
                                    value="Fixed"
                                    defaultChecked={filter.state === 'Fixed'}
                                    className="h-4 w-4 cursor-pointer border-gray-300 bg-gray-100 text-gray-600 focus:ring-2"
                                />
                                <label
                                    htmlFor="fixed"
                                    className="ml-2  w-full flex cursor-pointer items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1.5 text-xs font-medium text-gray-600"
                                >
                                    Fixed <LockClosedIcon className="h-4 w-4" />
                                </label>
                            </div>
                        </div>
                    </div>
                </fieldset>
            </div>
            <div className="mt-6 flex justify-end gap-4">
                <Button type="submit">Filter</Button>
            </div>
        </form>
    );
}
