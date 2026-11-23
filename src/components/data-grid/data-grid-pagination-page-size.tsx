import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from '@/components/ui/label'
import { useDataGrid } from "@/hooks/use-data-grid"
import { useCallback, type ComponentProps } from "react"
import { cn } from "@/lib/utils"

const PAGE_SIZES = ["10", "25", "50", "100"] as const

interface DataGridPaginationPageSizeProps extends ComponentProps<'div'>
{

}

export default function DataGridPaginationPageSize({ className, ...props }: DataGridPaginationPageSizeProps)
{
    const { payload, dataGridDef } = useDataGrid()

    const onPageSizeChange = useCallback((pageSize: string = "10") =>
    {
        dataGridDef.setPageSize(Number(pageSize))
    }, [payload.pageSize])

    return (
        <div className={cn("h-14 w-fit flex items-center gap-2", className)} {...props}>
            <Label className='text-xs text-nowrap'>Rows per page</Label>
            <Select value={payload.pageSize.toString()} onValueChange={onPageSizeChange}>
                <SelectTrigger className='w-18'>
                    <SelectValue className='w-fit' />
                </SelectTrigger>
                <SelectContent align='center' side='bottom' className='min-w-16'>
                    {PAGE_SIZES.map(pageSize => (
                        <SelectItem key={pageSize} value={pageSize}>{pageSize}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
