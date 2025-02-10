"use client"

import * as React from "react"
import {Check, SortDesc} from "lucide-react"

import {cn} from "@/lib/general/utils"
import {Button} from "@/components/ui/button"
import {Command, CommandGroup, CommandItem, CommandList,} from "@/components/ui/command"
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover"
import {Sort} from "@/lib/definitions";
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {useSession} from "next-auth/react";
import useUserPrefs from "@/lib/hooks/useUserPrefs";

const sortings = [
    {
        value: Sort.NEWEST.valueOf(),
        label: "Newest",
    },
    {
        value: Sort.OLDEST.valueOf(),
        label: "Oldest",
    },
    {
        value: Sort.PUBLICATION_YEAR_NEWEST.valueOf(),
        label: "Newest Publication",
    },
    {
        value: Sort.PUBLICATION_YEAR_OLDEST.valueOf(),
        label: "Oldest Publication",
    },
    {
        value: Sort.PUBLISHER.valueOf(),
        label: "Publisher",
    },
    {
        value: Sort.STATE.valueOf(),
        label: "State",
    },
]

export function SortResourceBox() {
    const [open, setOpen] = React.useState(false)
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { data, status } = useSession();
    const { userPrefs, updateUserPrefs } = useUserPrefs(data?.user.id);

    function updateSorting(selection:string) {
        updateUserPrefs({sortType: selection });
        setOpen(false)

        const current = new URLSearchParams(searchParams?.entries() ? Array.from(searchParams?.entries()): undefined); // -> has to use this form

        if (!selection) {
            current.delete("sort");
        } else {
            current.set("sort", selection);
        }

        const search = current.toString();
        const query = search ? `?${search}` : "";

        router.push(`${pathname}${query}`);
    }

    return (
        <>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        id="sort"
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="flex max-w-48 w-48 mb-4 justify-self-end"
                    >
                        {userPrefs.sortType
                            ? sortings.find((sortType) => sortType.value === userPrefs.sortType)?.label
                            : "Sort order"}
                        <SortDesc className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                    <Command>
                        <CommandList>
                            <CommandGroup>
                                {sortings.map((sort) => (
                                    <CommandItem
                                        key={sort.value}
                                        value={sort.value}
                                        onSelect={(currentValue) => updateSorting(currentValue)}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                userPrefs.sortType === sort.value ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {sort.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover></>
    )
}
