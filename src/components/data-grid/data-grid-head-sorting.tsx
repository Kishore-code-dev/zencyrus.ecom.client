import type { Header } from '@tanstack/react-table'
import { ArrowDownWideNarrow, ArrowUpDown, ArrowUpWideNarrow } from 'lucide-react'
import { useMemo, type ComponentProps } from 'react'
import { DropdownMenuCheckboxItem, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu'
import type { RowData } from '@/types/common'
import { cn } from '@/lib/utils'

interface DataGridHeadSortingProps extends ComponentProps<typeof DropdownMenuGroup>
{
    header: Header<RowData, unknown>
}


export default function DataGridHeadSorting(props: DataGridHeadSortingProps)
{
    const { header, className } = props
    const isCanSorting = useMemo(() => header.column.getCanSort(), [header.column])

    if (!isCanSorting)
    {
        return null;
    }

    return (
        <DropdownMenuGroup className={cn(className)} {...props}>
            <DropdownMenuSeparator />
            <DropdownMenuCheckboxItem
                className="relative pr-8 pl-2 [&>span:first-child]:right-2 [&>span:first-child]:left-auto [&_svg]:text-muted-foreground"
                checked={header.column.getIsSorted() == "asc"}
                onClick={() => header.column.toggleSorting(false)}
            >
                <ArrowUpWideNarrow />
                Sort Ascending
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
                className="relative pr-8 pl-2 [&>span:first-child]:right-2 [&>span:first-child]:left-auto [&_svg]:text-muted-foreground"
                checked={header.column.getIsSorted() == "desc"}
                onClick={() => header.column.toggleSorting(true)}
            >
                <ArrowDownWideNarrow />
                Sort Descending
            </DropdownMenuCheckboxItem>
            {header.column.getIsSorted() && (
                <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        className="pl-2 [&_svg]:text-muted-foreground"
                        onClick={() => header.column.clearSorting()}
                    >
                        <ArrowUpDown />
                        Clear sort
                    </DropdownMenuItem>
                </>
            )}
        </DropdownMenuGroup>
    )
}
