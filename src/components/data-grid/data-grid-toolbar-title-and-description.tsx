import { useDataGrid } from '@/hooks/use-data-grid'
import { Skeleton } from '@/components/ui/skeleton'
import DataGridToolbarMenuCloseButton from './data-grid-toolbar-close-button'
import type { ComponentProps } from 'react'

interface DataGridToolbarTitleAndDescriptionProps extends ComponentProps<'aside'>
{

}

export default function DataGridToolbarTitleAndDescription({ className, ...props }: DataGridToolbarTitleAndDescriptionProps)
{
    const { title, description, loading, isRender } = useDataGrid()

    return (
        <div className='grid grid-cols-1 gap-2'>
            {
                loading
                    ? (
                        <>
                            <Skeleton className='h-3.5 w-72' />
                            <Skeleton className='h-3.5 w-56' />
                        </>
                    )
                    : (
                        <header className='h-20 w-full p-2.5 border-b bg-background flex flex-row justify-between items-center-safe' {...props}>
                            <nav className='h-full w-full flex flex-col justify-center gap-1'>
                                <h3 className='text-2xl font-semibold tracking-tight'>{title}</h3>
                                <p className='text-sm text-muted-foreground'>{description}</p>
                            </nav>
                            {isRender.open && <DataGridToolbarMenuCloseButton className='ml-auto' />}
                        </header>
                    )
            }
        </div>
    )
}
