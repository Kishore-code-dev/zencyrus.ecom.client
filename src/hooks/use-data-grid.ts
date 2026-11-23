import { DataGridContextProvider } from '@/providers/data-grid-provider';
import { useContext } from 'react'

export function useDataGrid()
{
    const context = useContext(DataGridContextProvider)

    if (!context)
        throw new Error("useDataGrid use within the DataGridProvider.")

    return context;
}
