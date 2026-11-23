import { memo, useMemo, type CSSProperties, type PropsWithChildren } from "react"
import { Table, TableHeader, TableBody, TableRow, TableCell } from "@/components/ui/table"
import { useDataGrid } from "@/hooks/use-data-grid"
import DataGridHead from "./data-grid-head"
import DataGridCell from "./data-grid-cell"
import DataGridContentSkeleton from "./data-grid-content-skeleton"
import DataGridInlineAction from "./data-grid-inline-action"

function DataGridContent({ children }: PropsWithChildren)
{
    const { dataGridDef, loading, columns, mode, isRender } = useDataGrid()

    const totalTableWidth = useMemo(() =>
    {
        return dataGridDef.getTotalSize()
    }, [dataGridDef.getState().columnSizing])

    const tableProps = {
        style: {
            width: `${totalTableWidth}px`,
            tableLayout: 'fixed' as const,
        } as CSSProperties
    }

    if (loading)
    {
        return (
            <DataGridContentSkeleton />
        )
    }

    if (children && mode == "INLINE_DATA_GRID" && isRender.open)
    {
        return (
            <DataGridInlineAction>
                {children}
            </DataGridInlineAction>
        )
    }

    return (
        <div className='[&>div]:rounded-sm [&>div]:border bg-background'>
            <Table className="relative" {...tableProps}>
                <TableHeader className='sticky top-0 border border-borders'>
                    {dataGridDef.getHeaderGroups().map((headerGroup, headerGroupIndex) => (
                        <TableRow key={`${headerGroup.id}-${headerGroupIndex}`}>
                            {headerGroup.headers.map((header) => (
                                <DataGridHead key={header.id} header={header} />
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {dataGridDef.getRowModel().rows.length == 0
                        ? (
                            <TableRow>
                                <TableCell colSpan={columns.length + 1} className="m-auto text-center">No rows</TableCell>
                            </TableRow>
                        )
                        : (
                            dataGridDef.getRowModel().rows.map(row => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
                                    {row.getVisibleCells().map(cell => (
                                        <DataGridCell key={cell.id} cell={cell} />
                                    ))}
                                </TableRow>
                            ))
                        )}
                </TableBody>
            </Table>
        </div>
    )
}

export default memo(DataGridContent)