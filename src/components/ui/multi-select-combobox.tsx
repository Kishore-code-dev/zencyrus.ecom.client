import React, { useMemo, type ComponentProps, type FC, type ReactElement, type ReactNode } from "react"
import { Check, ChevronDown, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { type Dispatch } from "react"
import { type OptionItem } from "@/types/common"
import { api } from "@/config/api"
import { toast } from "sonner"
import { debounce } from "@/lib/debounce"
import type { Filter } from "@/types/filter"

interface MultiselectComboboxProps extends Omit<ComponentProps<"button">, "value">
{
    value?: OptionItem[];
    onValueChange?: Dispatch<OptionItem[]>;
    options?: OptionItem[];
    cascadeFilter?: Filter[];
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    path?: string;
    readonly?: boolean;
    mode?: "static" | "dynamic" | "url";
    children?: ReactNode;
    renderItem?: (option: OptionItem) => ReactElement;
    displayLimit?: number
}

function DefaultRenderItem(option: OptionItem)
{
    return <span>{option.label}</span>
}

export const MultiSelectCombobox: FC<MultiselectComboboxProps> = ({
    value = [],
    onValueChange,
    options = [],
    cascadeFilter = [],
    placeholder = "Select items",
    className,
    disabled = false,
    path = "",
    mode = "dynamic",
    readonly = false,
    renderItem = DefaultRenderItem,
    displayLimit = 10,
    children,
    ref,
    ...props
}) =>
{
    const [open, setOpen] = React.useState(false)
    const [items, setItems] = React.useState<OptionItem[]>([...options]);
    const [loading, setLoading] = React.useState(false);

    const isShouldFilter: boolean = mode === "static";

    const selectedValues = useMemo(
        () => Array.isArray(value) ? new Set(value.map(x => x.value)) : new Set<string>(),
        [value]
    );

    const fetchData = React.useCallback(async (payload: string = "") =>
    {
        setLoading(true);
        try
        {
            const response = await api.post(`${path}=${payload}`, {
                defaultValue: value.map(x => x.value),
                cascadeFilter
            });
            if (response.status === 200)
            {
                setItems(response.data || []);
            }
        } catch (error)
        {
            toast.error("Something went wrong.");
        } finally
        {
            setLoading(false);
        }
    }, [path, cascadeFilter, value]);

    const onSearchChanges = React.useCallback(
        debounce((input: string) =>
        {
            if (mode === "dynamic")
            {
                fetchData(input);
            }
        }, 500),
        [mode, fetchData]
    );

    const handleSelect = (item: OptionItem) =>
    {
        const isSelected = selectedValues.has(item.value);
        const updatedValues = isSelected
            ? value.filter(v => v.value !== item.value)
            : [...value, item];

        if (onValueChange)
        {
            onValueChange(updatedValues);
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    ref={ref}
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className={cn(
                        "min-w-full max-w-max justify-between text-muted-foreground font-normal truncate text-xs p-2.5",
                        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
                        "disabled:opacity-100",
                        className
                    )}
                    disabled={disabled || readonly}
                    {...props}
                >
                    {selectedValues.size > 0 ? (
                        <div className="flex gap-1 flex-wrap">
                            {value.slice(0, displayLimit).map((option: OptionItem) => (
                                <Badge key={option.value} variant="secondary" className="rounded-md">
                                    {option.label}
                                </Badge>
                            ))}
                            {value.length > displayLimit && (
                                <Badge variant="secondary">
                                    +{value.length - displayLimit} more
                                </Badge>
                            )}
                        </div>
                    ) : (
                        <span>{placeholder}</span>
                    )}
                    {loading ? (
                        <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    ) : (
                        <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent
                className={cn(children
                    ? "w-72 max-h-96 p-0 rounded-sm overflow-auto relative"
                    : "min-w-(--radix-popper-anchor-width) max-w-(--radix-popper-anchor-width) max-h-96 p-0 rounded-sm overflow-auto relative")}
            >
                <Command shouldFilter={isShouldFilter}>
                    <CommandInput
                        placeholder="Search..."
                        onValueChange={onSearchChanges}
                    />
                    <CommandList>
                        {items.length === 0 ? (
                            <CommandEmpty>No item found.</CommandEmpty>
                        ) : (
                            <CommandGroup>
                                {items.map((item) =>
                                {
                                    const isSelected = selectedValues.has(item.value);
                                    return (
                                        <CommandItem
                                            key={item.value}
                                            value={item.value}
                                            onSelect={() => handleSelect(item)}
                                        >
                                            {renderItem(item)}
                                            <Check
                                                className={cn(
                                                    "h-4 w-4",
                                                    isSelected ? "opacity-100" : "opacity-0",
                                                    "ml-auto"
                                                )}
                                            />
                                        </CommandItem>
                                    );
                                })}
                            </CommandGroup>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};