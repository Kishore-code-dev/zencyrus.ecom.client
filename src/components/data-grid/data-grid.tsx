import DataGridProvider from '@/providers/data-grid-provider'
import type { DataGridProps } from '@/types/data-grid'
import { DataGridToolbar } from './data-grid-toolbar'
import { DataGridPagination } from './data-grid-pagination'
import DataGridContent from './data-grid-content'
import DataGridActionDialog from './data-grid-action-dialog'

export default function DataGrid(props: DataGridProps)
{
    return (
        <DataGridProvider {...props}>
            <DataGridToolbar />
            <DataGridContent>
                {props.children}
            </DataGridContent>
            <DataGridPagination />
            <DataGridActionDialog>
                {props.children}
            </DataGridActionDialog>
        </DataGridProvider>
    )
}
