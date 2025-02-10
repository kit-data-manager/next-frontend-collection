"use client"

import * as React from "react"
import {Check, ListOrdered} from "lucide-react"

import {cn} from "@/lib/general/utils"
import {Button} from "@/components/ui/button"
import {Command, CommandGroup, CommandItem, CommandList,} from "@/components/ui/command"
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover"
import {usePathname, useRouter, useSearchParams} from "next/navigation";
import {useSession} from "next-auth/react";
import useUserPrefs from "@/lib/hooks/useUserPrefs";

const sizes = [
    {
        value: "5",
        label: "5 Entries",
    },
    {
        value: "10",
        label: "10 Entries",
    },
    {
        value: "15",
        label: "15 Entries",
    },
    {
        value: "20",
        label: "20 Entries",
    },
    {
        value: "30",
        label: "30 Entries",
    }
]

export function PageSizeBox() {
    const [open, setOpen] = React.useState(false)

    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const { data, status } = useSession();
    const { userPrefs, updateUserPrefs } = useUserPrefs(data?.user.id);

    function updateSorting(selection:string) {
        updateUserPrefs({pageSize: selection });
        setOpen(false)

        const current = new URLSearchParams(searchParams?.entries() ? Array.from(searchParams?.entries()): undefined); // -> has to use this form

        if (!selection) {
            current.delete("size");
        } else {
            current.set("size", selection);
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
                        className="flex max-w-32 w-32 mb-4 justify-self-end"
                    >
                        {userPrefs.pageSize
                            ? sizes.find((size) => size.value === userPrefs.pageSize)?.label
                            : "Page size"}
                        <ListOrdered className="ml-2 h-4 w-4 shrink-0 opacity-50"/>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                    <Command>
                        <CommandList>
                            <CommandGroup>
                                {sizes.map((size) => (
                                    <CommandItem
                                        key={size.value}
                                        value={String(size.value)}
                                        onSelect={(currentValue) => updateSorting(currentValue)}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                userPrefs.pageSize === size.value ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {size.label}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover></>
    )
}
