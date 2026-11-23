import { Badge } from '@/components/ui/badge'
import { useDataGrid } from '@/hooks/use-data-grid'
import { cn } from '@/lib/utils'
import { useMemo, type ComponentProps } from 'react'

interface DataGridPaginationIndicatorProps extends ComponentProps<typeof Badge>
{

}

export default function DataGridPaginationIndicator({ className, ...props }: DataGridPaginationIndicatorProps)
{
    const { pagedResult } = useDataGrid()

    const {
        startRow,
        endRow,
        rowCount,
    } = useMemo(() =>
    {
        const rowCount = pagedResult.totalItems
        const startRow = ((pagedResult.pageNumber - 1) * pagedResult.pageSize + 1) <= 0 ? 0 : ((pagedResult.pageNumber - 1) * pagedResult.pageSize + 1)
        const endRow = Math.min(pagedResult.pageNumber * pagedResult.pageSize, rowCount)

        return {
            startRow,
            endRow,
            rowCount
        }
    }, [pagedResult])

    return (
        <Badge className={cn('text-xs rounded-md', className)} {...props}>{`${startRow}-${endRow} of ${rowCount}`}</Badge>
    )
}
