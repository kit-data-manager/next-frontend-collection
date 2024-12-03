import {Input} from "@/components/ui/input";
import {Skeleton} from "@/components/AutoComplete/Skeleton";
import {Checkbox} from "@/components/ui/checkbox";
import {ScrollArea} from "@/components/ui/scroll-area";

type Props = {
    selectedValues: string[];
    onSelectedValuesChange: (values: string[]) => void;
    searchValue: string;
    onSearchValueChange: (value: string) => void;
    items: Element[];
    isLoading?: boolean;
    emptyMessage?: string;
    placeholder?: string;
};

export type Element = {
    value: string;
    label: string;
    email:string;
}

export function AutoCompleteList({
                                                   selectedValues,
                                                   onSelectedValuesChange,
                                                   searchValue,
                                                   onSearchValueChange,
                                                   items,
                                                   isLoading
                                               }: Props) {

   /* const labels = useMemo(
        () =>
            items.reduce((acc, item) => {
                acc[item.value] = item.label;
                return acc;
            }, {} as Record<string, string>),
        [items]
    );

    const reset = () => {
        onSelectedValuesChange([]);
        onSearchValueChange("");
    };*/

    const onSelectItem = (inputValue: string, checked:boolean | 'indeterminate') => {
        if(checked){
            const newValues = [...selectedValues];
            newValues.push(inputValue);
            onSelectedValuesChange(newValues);
        }else{
            const newValues = [...selectedValues];
            newValues.splice(newValues.indexOf(inputValue), 1);
            onSelectedValuesChange(newValues);
        }
    };

    return (
        <div className="grid grid-cols-1 items-center m-4  w-full">
            <Input type="email" className={"mb-4"} placeholder="Email" value={searchValue}
                   onChange={(e) => onSearchValueChange(e.currentTarget.value)}/>
            <ScrollArea className="h-[200px] w-full rounded-md border p-4">

            {items.length > 0 && !isLoading ? (
                <>
                    {items.map((option) => (
                        <div key={option.value} className="flex items-center space-x-2 m-2">
                            <Checkbox
                                id={option.value}
                                title={option.email}
                                checked={selectedValues.includes(option.value)}
                                disabled={selectedValues.includes(option.value)}
                                onCheckedChange={(checked) => onSelectItem(option.value, checked)} />
                            <label
                                htmlFor={option.value}
                                className="text-sm font-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                {option.label}
                            </label>
                        </div>
                    ))}
                </>
            ) : null}
                {items.length === 0 && !isLoading ? (
                    <Skeleton>No user matching.</Skeleton>
                ):null}
            </ScrollArea>

        </div>
    );
}
