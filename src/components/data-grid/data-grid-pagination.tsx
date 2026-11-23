import { type ComponentProps } from 'react'
import { cn } from '@/lib/utils'
import DataGridPaginationPageSize from './data-grid-pagination-page-size'
import DataGridPaginationPageNumber from './data-grid-pagination-page-number'
import DataGridPaginationIndicator from './data-grid-pagination-indicator'
import { useDataGrid } from '@/hooks/use-data-grid'

interface DataGridPaginationProps extends ComponentProps<'footer'> { }


function DataGridPagination({ className, children, ...props }: DataGridPaginationProps)
{
    const { isRender, mode } = useDataGrid()

    if ((mode == "DEFAULT_DATA_GRID" || mode == "INLINE_DATA_GRID") && isRender.open && isRender.action !== "none")
    {
        return null
    }

    return (
        <footer className={cn('h-14 w-full flex items-center justify-center gap-2 p-2 bg-background border border-border rounded-md', className)} {...props}>
            <DataGridPaginationIndicator className='mr-auto' />
            <DataGridPaginationPageSize />
            <DataGridPaginationPageNumber />
            {children}
        </footer>
    )
}

export { DataGridPagination }