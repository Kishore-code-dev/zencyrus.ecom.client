import { GlobalAlertBoxContext } from '@/providers/global-alert-box-provider'
import { useContext } from 'react'

export function useGlobalAlertBox()
{
    const context = useContext(GlobalAlertBoxContext)

    if (!context)
    {
        throw new Error("useGlobalAlertBox must be used within a PagedResultProvider")
    }

    return context
}