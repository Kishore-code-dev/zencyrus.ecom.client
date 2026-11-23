import { Separator } from "@/components/ui/separator";
import { TableCell } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { RowData } from "@/types/common";
import { flexRender, type Cell } from "@tanstack/react-table";
import type { ComponentProps } from "react";
import { getCommonPinningStyles } from "@/lib/get-common-pinning-style";
import DataGridCellRenderType from "./data-grid-cell-render-type";

interface DataGridCellProps extends ComponentProps<typeof TableCell>
{
    cell: Cell<RowData, unknown>
}

export default function DataGridCell({ cell, className, ...props }: DataGridCellProps)
{
    const style = getCommonPinningStyles({ column: cell.column })

    if (cell.column.id == "id")
    {
        return (
            <TableCell className="relative h-5 min-w-10 max-w-10" style={style} {...props}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                <Separator className="h-full absolute top-0 right-0" orientation="vertical" />
            </TableCell>
        )
    }

    return (
        <TableCell className={cn("relative h-5 w-fit group", className)} style={style} {...props}>
            <DataGridCellRenderType cell={cell} />
            <Separator orientation="vertical" className="h-full absolute top-0 right-0 bg-border" />
        </TableCell>
    )
}

