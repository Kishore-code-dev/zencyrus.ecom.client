import PagedResultProvider from '@/providers/paged-result-provider'
import type { PagedResultProps } from '@/types/paged-result'
import PagedResultPagination from './paged-result-page-number'
import PagedResultPageSize from './paged-result-page-size'

export default function PagedResult({ children, ...props }: PagedResultProps)
{
    return (
        <PagedResultProvider {...props}>
            {children}
        </PagedResultProvider>
    )
}

PagedResult.Pagination = PagedResultPagination
PagedResult.PageSize = PagedResultPageSize