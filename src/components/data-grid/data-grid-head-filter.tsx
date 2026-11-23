import z from 'zod'
import type { Header } from '@tanstack/react-table'
import { useCallback, useMemo, type ComponentProps } from 'react'
import { DropdownMenuGroup, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import type { ColumnMeta } from "@/types/data-grid"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { DatePicker } from '@/components/ui/date-picker'
import { cn } from '@/lib/utils'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import { MultiSelectCombobox } from "@/components/ui/multi-select-combobox"
import { Combobox } from '@/components/ui/combobox'
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { filterConfig } from '@/config/filter'
import type { FilterOptionItem } from '@/types/filter'
import { TagsInput } from '@/components/ui/tags-input'
import { useDataGrid } from '@/hooks/use-data-grid'
import type { OptionItem, RowData } from '@/types/common'

interface DataTableColumnFilter extends ComponentProps<typeof DropdownMenuGroup>
{
    header: Header<RowData, unknown>
}

const formSchema = z.object({
    logic: z.string().optional(),
    alias: z.string(),
    dataType: z.string().optional(),
    matchCase: z.string().optional(),
    value: z.any().optional()
});

export default function DataGridHeadFilter({ header, className, ...props }: DataTableColumnFilter)
{
    const meta = header.column.columnDef.meta as ColumnMeta ?? {}
    const filterByItems = useMemo(() => filterConfig[meta["variant"] as keyof FilterOptionItem] || [], [meta])
    const { payload } = useDataGrid()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: header.column.getFilterValue() ?? {
            logic: "None",
            alias: meta.alias,
            dataType: meta.dataType,
            matchCase: "None",
            value: undefined
        }
    })

    const defaultValue = useMemo(() =>
    {
        switch (meta.dataType)
        {
            case "numeric":
                return 0;
            case "array":
                return []
            case "boolean":
                return false
            case "date":
                return new Date()
            case "json":
                return ({
                    label: "",
                    value: ""
                })
            case "file":
            case "time":
            case "html":
            case "text":
            default:
                return ""
        }
    }, [header])

    const handleOnApplyFilter = useCallback(async (filterPayload: z.infer<typeof formSchema>) =>
    {
        const newFilterPayload = {
            ...filterPayload,
            value: (filterPayload.value instanceof Object && 'value' in filterPayload.value)
                ? (filterPayload.value as OptionItem).value
                : filterPayload.value
        } as z.infer<typeof formSchema>

        header.column.setFilterValue(newFilterPayload)
    }, [payload])

    const handleOnReset = useCallback(async () =>
    {
        header.column.clearSorting()
        header.column.setFilterValue(undefined)
    }, [header, payload])

    if (!header.column.getCanFilter())
    {
        return null;
    }

    return (
        <DropdownMenuGroup {...props} className={cn(className)}>
            <DropdownMenuSeparator />
            <form className='h-fit w-full flex flex-col gap-2.5' onSubmit={form.handleSubmit(handleOnApplyFilter)}>
                <Form {...form}>
                    <>
                        <FormField
                            name='dataType'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem className='hidden'>
                                    <Input {...field} value={meta.dataType} />
                                </FormItem>
                            )}
                        />
                        <FormField
                            name='matchCase'
                            control={form.control}
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel htmlFor='filterBy'>Filter By</FormLabel>
                                    <Select value={field.value} onValueChange={field.onChange}>
                                        <FormControl>
                                            <SelectTrigger className='w-full'>
                                                <SelectValue placeholder="Filter by" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {filterByItems.map((filter, i) => (
                                                <SelectItem value={filter.value} key={i + filter.value}>
                                                    {filter.label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormItem>
                            )}
                        />
                        <FormField
                            name='value'
                            control={form.control}
                            defaultValue={defaultValue}
                            render={({ field }) =>
                            {

                                if (!meta)
                                {
                                    return (
                                        <FormItem className='min-w-48'>
                                            <FormControl>
                                                <Input {...field} placeholder='Enter the value' />
                                            </FormControl>
                                        </FormItem>
                                    )
                                }

                                switch (meta.variant)
                                {
                                    case "text":
                                    case "email":
                                    case "textarea":
                                        {
                                            return (
                                                <FormItem className='min-w-48'>
                                                    <FormControl>
                                                        <Input {...field} placeholder='Enter the value' />
                                                    </FormControl>
                                                </FormItem>
                                            )

                                        }
                                    case "numeric":
                                        {
                                            return (
                                                <FormItem className='min-w-48'>
                                                    <FormControl>
                                                        <Input type='number' {...field} placeholder='Enter the value' />
                                                    </FormControl>
                                                </FormItem>
                                            )

                                        }
                                    case "date":
                                        {
                                            return (
                                                <FormItem className='min-w-48'>
                                                    <FormControl>
                                                        <DatePicker placeholder="Select the date" ref={field.ref} value={field.value} onValueChange={field.onChange} />
                                                    </FormControl>
                                                </FormItem>
                                            )

                                        }
                                    case "checkbox":
                                    case "toggle":
                                        {
                                            return (
                                                <FormItem className='min-w-48'>
                                                    <FormControl>
                                                        <Switch ref={field.ref} checked={field.value} onCheckedChange={field.onChange} />
                                                    </FormControl>
                                                </FormItem>
                                            )

                                        }

                                    case "range":
                                        {
                                            return (
                                                <FormItem className='min-w-48'>
                                                    <FormControl>
                                                        <Input type="number" placeholder="Enter the value" />
                                                    </FormControl>
                                                </FormItem>
                                            )
                                        }

                                    case "select": {
                                        if (meta.mode == "dynamic")
                                        {
                                            return (
                                                <FormItem className='min-w-48'>
                                                    <FormControl>
                                                        <Combobox
                                                            path={`${meta.path}`}
                                                            placeholder="Select the value"
                                                            value={field.value}
                                                            onValueChange={field.onChange}
                                                            mode={meta.mode}
                                                            options={meta.options || []}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )
                                        }

                                        return (
                                            <FormItem>
                                                <Select value={field.value} onValueChange={field.onChange}>
                                                    <FormControl>
                                                        <SelectTrigger className='w-full'>
                                                            <SelectValue placeholder="Select the value" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {meta.options.map((option, index) => (
                                                            <SelectItem key={index} value={option.value}>{option.label}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FormItem>
                                        )
                                    }

                                    case "combobox":
                                    case "radio":
                                        {
                                            return (
                                                <FormItem className='min-w-48'>
                                                    <FormControl>
                                                        <Combobox
                                                            path={`${meta.path}?searchString`}
                                                            placeholder="Select the value"
                                                            value={field.value}
                                                            onValueChange={field.onChange}
                                                            mode={meta.mode}
                                                            options={meta.options || []}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )
                                        }
                                    case "multiselect":
                                    case "multicheckbox":
                                        {
                                            return (
                                                <FormItem className='min-w-48'>
                                                    <FormControl>
                                                        <MultiSelectCombobox
                                                            path={`${meta.path}`}
                                                            placeholder="Select the value"
                                                            value={Array.isArray(field.value) ? field.value : [...field.value]}
                                                            onValueChange={field.onChange}
                                                            mode={meta.mode}
                                                            options={meta.options || []}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )
                                        }
                                    case "taginput":
                                        {
                                            return (
                                                <FormItem className='min-w-48'>
                                                    <FormControl>
                                                        <TagsInput
                                                            placeholder="Enter the value"
                                                            ref={field.ref}
                                                            value={Array.isArray(field.value) ? field.value : []}
                                                            onValueChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )
                                        }
                                    case "time":
                                    case "signature": {
                                        return <></>
                                    }
                                    default: {
                                        return (
                                            <FormItem className='min-w-48'>
                                                <FormControl>
                                                    <Input {...field} placeholder='Enter the value' />
                                                </FormControl>
                                            </FormItem >
                                        )
                                    }
                                }
                            }}
                        />
                    </>
                    <div className='ml-auto space-x-1.5'>
                        <Button type='reset' variant='outline' size='sm' onClick={handleOnReset}>Reset</Button>
                        <Button type='submit' variant='default' size='sm'>Apply</Button>
                    </div>
                </Form>
            </form>
        </DropdownMenuGroup>
    )
}
