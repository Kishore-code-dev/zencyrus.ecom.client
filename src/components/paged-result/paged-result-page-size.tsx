import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from '@/components/ui/label'
import { usePagedResult } from "@/hooks/use-paged-result"
import { useCallback, type ComponentProps } from "react"
import { cn } from "@/lib/utils"
import { useEffect } from "react"

type Props = ComponentProps<'div'> & {
    pageSizes?: number[]
    customPageSize?: boolean
}


export default function PagedResultPageSize({
    className,
    pageSizes = [10, 25, 50, 100],
    customPageSize = false,
    ...props
}: Props) {
    useEffect(() => {
        if (customPageSize && payload.pageSize === 10) {
            pagedResultDef.setPageSize(12)
        }
    }, [])
    const { payload, pagedResultDef } = usePagedResult()
    const currentPageSize =
        customPageSize && payload.pageSize === 10
            ? 12
            : payload.pageSize

    const onPageSizeChange = useCallback((pageSize: string = "10") =>
    {
        pagedResultDef.setPageSize(Number(pageSize))
    }, [payload.pageSize])

    return (
        <div className={cn("h-14 w-fit flex items-center gap-2", className)} {...props}>
            <Label className='text-xs text-nowrap'>Rows per page</Label>
            <Select value={currentPageSize.toString()} onValueChange={onPageSizeChange}>
                <SelectTrigger className='w-18'>
                    <SelectValue className='w-fit' />
                </SelectTrigger>
                <SelectContent align='center' side='bottom' className='min-w-16'>
                    {pageSizes.map(size => (
                        <SelectItem key={size} value={size.toString()}>
                            {size}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
