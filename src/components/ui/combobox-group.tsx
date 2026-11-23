import { useCallback, useMemo, useState, useTransition, type ComponentProps, type FC, type ReactElement, type ReactNode } from "react"
import { Check, ChevronDown, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import
{
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import
{
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { type Dispatch } from "react"
import { type GroupOptionItem, type OptionItem } from "@/types/common"
import { api } from "@/config/api"
import { toast } from "sonner"
import { debounce } from "@/lib/debounce"
import { ScrollArea } from "./scroll-area"
import type { Filter } from "@/types/filter"
import { useEffect } from "react"

export interface ComboboxProps extends Omit<ComponentProps<typeof Button>, "value">
{
  value?: OptionItem
  onValueChange?: Dispatch<OptionItem | null>
  options?: GroupOptionItem[]
  cascadeFilter?: Filter[],
  placeholder?: string
  className?: string
  disabled?: boolean
  path?: string
  readonly?: boolean
  mode?: "static" | "dynamic" | "url"
  children?: ReactNode
  renderItem?: (option: OptionItem) => ReactElement
}

function DefaultRenderItem(option: OptionItem)
{
  return <span key={option.value} className="text-xs ml-2">{option.label}</span>
}

export const ComboboxGroup: FC<ComboboxProps> = (
  ({
    value = { label: "None", value: "" },
    onValueChange,
    options = [],
    cascadeFilter = [],
    placeholder = "Select items",
    className,
    disabled = false,
    path = "",
    mode = "dynamic",
    readonly = false,
    children,
    renderItem = DefaultRenderItem,
    ref,
    ...props
  }) =>
  {
    const [open, setOpen] = useState(false)
    const [items, setItems] = useState<GroupOptionItem[]>([...options])
    const [loading, startTransition] = useTransition()
    useEffect(() =>
    {
      if (open && mode === "dynamic")
      {
        fetchData(" ");
      }
    }, [open]);
    const selectedValue = useMemo(() => value ? value : { label: "None", value: "" }, [value])
    const fetchData = useCallback(
      async (payload: string = "") =>
      {
        try
        {
          const url = payload
            ? `${path}=${payload}`
            : `${path}`

          const response = await api.post(url, {
            defaultValue: value?.value ? [value.value] : [],
            cascadeFilter
          })

          if (response.status === 200)
          {
            setItems(response.data || [])
          }
        } catch (error)
        {
          toast.error("Something went wrong.")
        }
      },
      [path, value, cascadeFilter]
    )


    const onSearchChanges = useCallback(
      debounce(async (input: string) =>
      {
        if (mode === "dynamic") 
        {
          startTransition(async () =>
          {
            await fetchData(input)
          })
        }
      }, 500),
      [fetchData, mode]
    )


    useEffect(() =>
    {
      if (open && mode === "dynamic")
      {
        startTransition(async () =>
        {
          await fetchData("")
        })
      }
    }, [open])

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          {children ?? (
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
              {(selectedValue && selectedValue.value && selectedValue.label) ? selectedValue.label : placeholder}
              {loading ? <Loader2 className="animate-spin ml-auto opacity-50" /> : <ChevronDown className="ml-auto opacity-50" />}
            </Button>
          )}
        </PopoverTrigger>
        <PopoverContent
          className={cn(children
            ? "w-72 max-h-96 p-0 rounded-sm overflow-auto relative"
            : "min-w-(--radix-popper-anchor-width) max-w-(--radix-popper-anchor-width) max-h-96 p-0 rounded-sm overflow-auto relative")}
        >
          <Command shouldFilter={true}>
            <CommandInput
              placeholder={placeholder}
              className="h-9"
              onValueChange={onSearchChanges}
            />
            <CommandList>
              <CommandGroup>
                <ScrollArea>
                  {items.length == 0
                    ? (
                      <CommandEmpty>No item found.</CommandEmpty>
                    )
                    : (
                      items.map((item) => (
                        <CommandGroup key={item.group.value} heading={item.group.label}>
                          {
                            item.groupItems.map((groupItem, i) => (
                              <CommandItem
                                key={i}
                                value={groupItem.label}
                                onSelect={() =>
                                {
                                  const isSelected = selectedValue?.value == groupItem.value
                                  if (onValueChange)
                                  {
                                    onValueChange(isSelected ? null : groupItem)
                                    setOpen(false)
                                  }
                                }}
                              >
                                {renderItem(groupItem)}
                                <Check
                                  className={cn(
                                    "ml-auto",
                                    selectedValue?.value == groupItem.value ? "opacity-100" : "opacity-0"
                                  )}
                                />
                              </CommandItem>
                            ))}
                        </CommandGroup>
                      ))
                    )}
                </ScrollArea>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    )
  }
)

