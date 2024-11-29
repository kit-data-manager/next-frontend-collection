'use client';

import {CircleX, Filter, CircleUser, Calendar} from "lucide-react"

import {filterResources} from '@/lib/filter-form-actions';
import {FilterForm} from "@/app/base-repo/components/FilterForm/FilterForm.d";
import {Button} from "@/components/ui/button";
import React from "react";
import {useSession} from "next-auth/react";
import {getStateList, getTypeGeneralList} from "@/lib/filter-utils";
import {Label} from "@/components/ui/label";

export default function FilterResourceForm({filter}: {
    filter: FilterForm;
}) {
    const formRef = React.useRef<HTMLFormElement>(null);
    const { data, status } = useSession();
    const basePath: string = (process.env.NEXT_PUBLIC_BASE_PATH ? process.env.NEXT_PUBLIC_BASE_PATH : "");

    const doFilterResources = filterResources.bind(null);
    const doResetForm = () => {
        formRef.current?.reset();
        window.document.location = `${basePath}/base-repo/resources`;
    };

    const isAdmin = !!(data && data?.user.groups.includes("ROLE_ADMINISTRATOR"));
    const stateList = getStateList(isAdmin);
    const typeList = getTypeGeneralList();

    return (
        <div>
        <form action={doFilterResources} ref={formRef}>
            <div className="rounded-md">
                <div className="mb-4">
                    <Label htmlFor="publisher" className="mb-2 block text-sm font-medium">
                        Publisher
                    </Label>
                    <div className="relative">
                        <input
                            id="publisher"
                            name="publisher"
                            type="text"
                            placeholder="Publisher"
                            className="peer block w-auto cursor-pointer rounded-md border py-2 pl-10 text-sm outline-2 bg-secondary placeholder:text-gray-500"
                            defaultValue={filter.publisher}
                        >
                        </input>
                        <CircleUser
                            className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500"/>
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
                                className="peer block w-auto rounded-md border py-2 pl-10 text-sm outline-2 bg-secondary placeholder:text-gray-500"
                            />
                            <Calendar
                                className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900"/>
                        </div>
                    </div>
                </div>

                <fieldset className="mb-4">
                    <legend className="mb-2 block text-sm font-medium">
                        Resource Status
                    </legend>
                    <div className="rounded-md w-full border py-3">
                        <div className="ml-4">
                            {stateList.map(key => {
                                return (
                                    <div key={key} className="flex w-auto items-center">
                                        <input
                                            id={key.toLowerCase()}
                                            name="state"
                                            type="radio"
                                            value={key}
                                            defaultChecked={filter.state === key}
                                            className="h-4 w-4 cursor-pointer focus:ring-2"
                                        />
                                        <label
                                            htmlFor={key.toLowerCase()}
                                            className="ml-2 flex cursor-pointer items-center gap-1.5  px-3 py-1.5 text-xs font-medium"
                                        >
                                            {key}
                                        </label>
                                    </div>)
                            })}
                        </div>
                    </div>
                </fieldset>

                <fieldset>
                    <legend className="mb-2 block text-sm font-medium">
                        General Type
                    </legend>
                    <div className="rounded-md border py-3">
                        <div className="ml-4">
                            {typeList.map(key => {
                                return (<div key={key} className="flex items-center">
                                    <input
                                        id={key.toLowerCase()}
                                        name="typeGeneral"
                                        type="radio"
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
                                </div>
                                )
                            })}

                        </div>
                    </div>
                </fieldset>
            </div>
            <Button type="submit" variant="outline" className={"flex w-full mt-4"}><Filter className="h-5 w-5 me-2"/> Filter</Button>
        </form>
        <Button type="reset" variant="outline" className={"flex w-full mt-4"} onClick={() => doResetForm()}><CircleX className="h-5 w-5 me-2"/> Clear</Button>
    </div>
);
}
