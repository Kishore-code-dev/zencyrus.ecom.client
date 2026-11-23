import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import type { RowData } from '@/types/common'
import type { Header } from '@tanstack/react-table'
import { type ComponentProps } from 'react'

interface DataGridHeaderSizingProps extends ComponentProps<'div'>
{
    header: Header<RowData, unknown>
}

export default function DataGridHeaderSizing({ header, ...props }: DataGridHeaderSizingProps)
{
    const resizerHandler = header.getResizeHandler()
    const isSizing: boolean = header.column.getCanResize()
    const isResizing: boolean = header.column.getIsResizing()
    if (!isSizing)
    {
        return null;
    }

    return (
        <div
            onMouseDown={resizerHandler}
            onTouchStart={resizerHandler}
            className='absolute top-0 right-0 h-full w-2.5 z-10 grid cursor-col-resize user-select-none touch-none'
        >
            <Separator
                className={cn('h-full mx-2 bg-border', isResizing && "bg-primary")}
                orientation='vertical'
                {...props}
            />
        </div>
    )
}
