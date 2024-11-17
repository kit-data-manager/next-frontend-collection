"use client"

import * as React from "react"
import {Check, ChevronsUpDown} from "lucide-react"

import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button"
import {
    Command,
    CommandGroup,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {Sort} from "@/lib/definitions";
import {Label} from "@/components/ui/label";
import {usePathname, useRouter, useSearchParams} from "next/navigation";

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
    const [value, setValue] = React.useState("")
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    function updateSorting(selection:string) {
        setValue(selection)
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
            <Label htmlFor="sort" className="mb-2 block text-sm font-medium">
                Sort Order
            </Label>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        id="sort"
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-full mb-4 justify-between"
                    >
                        {value
                            ? sortings.find((framework) => framework.value === value)?.label
                            : "Select sort order..."}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
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
                                                value === sort.value ? "opacity-100" : "opacity-0"
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
