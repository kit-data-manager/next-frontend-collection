'use client';

import {
    CalendarIcon,
    UserCircleIcon,
} from '@heroicons/react/24/outline';
import { filterResources } from '@/lib/actions';
import {Button} from "@/components/general/button";
import {FilterForm} from "@/app/base-repo/components/FilterForm/FilterForm.d";

export default function FilterResourceForm({filter}: {
    filter: FilterForm;
}) {
    const doFilterResources = filterResources.bind(null);

    return (
        <form action={doFilterResources}>
            <div className="rounded-md p-4 md:p-6">
                <div className="mb-4">
                    <label htmlFor="customer" className="mb-2 block text-sm font-medium">
                        Publisher
                    </label>
                    <div className="relative">
                        <input
                            id="publisher"
                            name="publisher"
                            type="text"
                            placeholder="Publisher"
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

                <fieldset className="mb-4">
                    <legend className="mb-2 block text-sm font-medium">
                        Resource Status
                    </legend>
                    <div className="rounded-md border py-3">
                        <div className="ml-4">
                            { ['VOLATILE', 'FIXED'].map(key => {
                            return (
                                <div key={key} className="flex items-center">
                                  <input
                                    id={key.toLowerCase()}
                                    name="state"
                                    type="checkbox"
                                    value={key}
                                    defaultChecked={filter.state === key}
                                    className="h-4 w-4 cursor-pointer  focus:ring-2"
                                />
                                <label
                                    htmlFor={key.toLowerCase()}
                                    className="ml-2 w-full flex cursor-pointer items-center gap-1.5  px-3 py-1.5 text-xs font-medium text-gray-600"
                                >
                                    {key}
                                </label>
                            </div>)
                            }) }
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend className="mb-2 block text-sm font-medium">
                        General Type
                    </legend>
                    <div className="rounded-md border py-3">
                        <div className="ml-4">
                            { ['AUDIOVISUAL' ,'COLLECTION' , 'DATASET' , 'EVENT' , 'IMAGE' , 'INTERACTIVE_RESOURCE' , 'MODEL' ,
                            'PHYSICAL_OBJECT' , 'SERVICE' , 'SOFTWARE' , 'SOUND' , 'TEXT' , 'WORKFLOW' , 'OTHER'].map(key => {
                                return (<div key={key} className="flex items-center">
                                    <input
                                        id={key.toLowerCase()}
                                        name="typeGeneral"
                                        type="checkbox"
                                        value={key}
                                        defaultChecked={filter.typeGeneral === key}
                                        className="h-4 w-4 cursor-pointer focus:ring-2"
                                    />
                                    <label
                                        htmlFor={key.toLowerCase()}
                                        className="ml-2 w-full flex cursor-pointer items-center gap-1.5  px-3 py-1.5 text-xs font-medium"
                                    >
                                        {key}
                                    </label>
                                </div>)
                            }) }
                        </div>
                    </div>
                </fieldset>


            </div>
            <div className="flex justify-end p-4 md:p-6">
                <Button type="submit">Filter</Button>
            </div>
        </form>
    );
}
