import { PagedResultContextProvider } from '@/providers/paged-result-provider'
import { useContext } from 'react'

export function usePagedResult()
{
    const context = useContext(PagedResultContextProvider)

    if (!context)
    {
        throw new Error("usePagedResult must be used within a PagedResultProvider")
    }

    return context
}
