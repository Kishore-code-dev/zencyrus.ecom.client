import { Input } from "@/components/ui/input"
import { useDataGrid } from "@/hooks/use-data-grid"
import { cn } from "@/lib/utils"
import { useCallback, useState, type ChangeEvent, type ComponentProps, type KeyboardEvent } from "react"

interface DataGridToolbarMenuSearchBarProps extends ComponentProps<typeof Input>
{

}

export default function DataGridToolbarMenuSearchBar({ className, ...props }: DataGridToolbarMenuSearchBarProps)
{
    const { payload, fetchPagedResultAsync, placeholder } = useDataGrid()
    const [searchString, setSearchString] = useState(payload.searchString)
    const onChange = useCallback((event: ChangeEvent<HTMLInputElement>) =>
    {
        setSearchString(event.target.value.trim())
    }, [])
    const onKeyDown = useCallback(async (event: KeyboardEvent<HTMLInputElement>) =>
    {
        if (event.key.toLowerCase() == "enter")
        {
            await fetchPagedResultAsync({ ...payload, searchString, pageNumber: 1 })
        }
    }, [searchString])

    return (
        <Input
            className={cn("w-xs", className)}
            value={searchString}
            onChange={onChange}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
            {...props}
        />
    )
}
