import { Button } from '@/components/ui/button'
import { usePagedResult } from '@/hooks/use-paged-result'
import { useMemo, type ComponentProps } from 'react'
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem } from '@/components/ui/pagination'
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'



export default function PagedResultPageNumber({ className, ...props }: ComponentProps<typeof Pagination>)
{
    const { pagedResult, pagedResultDef } = usePagedResult()

    const {
        canNext,
        canPrevious,
        onFirstPage,
        onLastPage,
        onNextPage,
        onPreviousPage,
        onPageNumberChange,
        currentPageNumber,
        pageNumbers,
        showLeftEllipsis,
        showRightEllipsis,
    } = useMemo(() =>
    {
        const rowCount = pagedResult.totalItems
        const totalPages = pagedResult.totalPages
        const pageNumber = pagedResult.pageNumber
        const startRow = ((pagedResult.pageNumber - 1) * pagedResult.pageSize + 1) <= 0 ? 0 : ((pagedResult.pageNumber - 1) * pagedResult.pageSize + 1)
        const endRow = Math.min(pagedResult.pageNumber * pagedResult.pageSize, rowCount)
        const showLeftEllipsis = pagedResult.pageNumbers.length > 0 && pagedResult.pageNumbers[0] > 2
        const showRightEllipsis = pagedResult.pageNumbers.length > 0 && pagedResult.pageNumbers[pagedResult.pageNumbers.length - 1] < pagedResult.totalPages - 1

        return {
            pageSize: pagedResult.pageSize,
            currentPageNumber: pagedResult.pageNumber,
            pageNumbers: pagedResult.pageNumbers,
            startRow,
            endRow,
            rowCount,
            showLeftEllipsis,
            showRightEllipsis,
            canPrevious: pagedResult.pageNumber <= 1,
            canNext: pagedResult.pageNumber == pagedResult.totalPages,
            onFirstPage: () => pagedResultDef.setPageIndex(1),
            onLastPage: () => pagedResultDef.setPageIndex(totalPages),
            onNextPage: () => pagedResultDef.setPageIndex(pageNumber + 1),
            onPreviousPage: () => pagedResultDef.setPageIndex(pageNumber - 1),
            onPageNumberChange: (newPageNumber: number) => pagedResultDef.setPageIndex(newPageNumber),
            onPageSizeChange: (pageSize: string) => pagedResultDef.setPageSize(Number(pageSize))
        }
    }, [pagedResultDef, pagedResult])



    return (
        <Pagination className={cn("w-fit m-0", className)} {...props}>
            <PaginationContent className='w-fit'>
                <PaginationItem>
                    <Button
                        size='icon'
                        variant='outline'
                        onClick={onFirstPage}
                        disabled={canPrevious}
                        aria-label='Go to first page'
                    >
                        <ChevronFirst className='h-4 w-4' />
                    </Button>
                </PaginationItem>
                <PaginationItem>
                    <Button
                        size='icon'
                        variant='outline'
                        onClick={onPreviousPage}
                        disabled={canPrevious}
                        aria-label='Go to previous page'
                    >
                        <ChevronLeft className='h-4 w-4' />
                    </Button>
                </PaginationItem>
                {showLeftEllipsis && (
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                )}
                {pageNumbers.map(pageNumber => (
                    <PaginationItem key={pageNumber} className='hidden md:block'>
                        <Button
                            size='icon'
                            variant={currentPageNumber === pageNumber ? "default" : "ghost"}
                            onClick={() => onPageNumberChange(pageNumber)}
                        >
                            {pageNumber}
                        </Button>
                    </PaginationItem>
                ))}
                {showRightEllipsis && (
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                )}
                <PaginationItem>
                    <Button
                        size='icon'
                        variant='outline'
                        onClick={onNextPage}
                        disabled={canNext}
                        aria-label='Go to next page'
                    >
                        <ChevronRight className='h-4 w-4' />
                    </Button>
                </PaginationItem>
                <PaginationItem>
                    <Button
                        size='icon'
                        variant='outline'
                        onClick={onLastPage}
                        disabled={canNext}
                        aria-label='Go to last page'
                    >
                        <ChevronLast className='h-4 w-4' />
                    </Button>
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    )
}
