import { TableHead } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from "@/components/ui/dropdown-menu"
import { flexRender, type Header, } from "@tanstack/react-table";
import type { RowData } from "@/types/common";
import type { ComponentProps } from "react";
import DataGridHeaderSizing from "./data-grid-head-sizing";
import { Button } from "@/components/ui/button";
import { EllipsisVertical } from "lucide-react";
import DataGridHeadPinning from "./data-grid-head-pinning";
import DataGridHeadSorting from "./data-grid-head-sorting";
import DataGridHeadFilter from "./data-grid-head-filter";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { getCommonPinningStyles } from "@/lib/get-common-pinning-style";

interface DataGridHeadProps extends ComponentProps<typeof TableHead>
{
    header: Header<RowData, unknown>
}

export default function DataGridHead({ header, className, ...props }: DataGridHeadProps)
{
    const style = getCommonPinningStyles({ column: header.column })

    if (header.column.id == "id")
    {
        return (
            <TableHead className="relative top-0 min-w-10 max-w-10" style={style} {...props}>
                {flexRender(header.column.columnDef.header, header.getContext())}
                <Separator className="h-full w-1.5 absolute top-0 right-0" orientation="vertical" />
            </TableHead>
        )
    }

    return (
        <DropdownMenu>
            <TableHead className={cn('relative min-w-max max-w-max bg-background select-none overflow-hidden', className)} style={style} {...props}>
                <div className="h-5 w-full bg-background flex items-center justify-between gap-2">
                    <span className="mr-auto">
                        {flexRender(header.column.columnDef.header, header.getContext())}
                    </span>
                    <DropdownMenuTrigger asChild>
                        <Button size="icon-sm" variant='ghost' className="ml-auto">
                            <EllipsisVertical />
                        </Button>
                    </DropdownMenuTrigger>
                </div>
                <DataGridHeaderSizing header={header} />
            </TableHead>
            <DropdownMenuContent>
                <DataGridHeadPinning header={header} />
                <DataGridHeadSorting header={header} />
                <DataGridHeadFilter header={header} />
            </DropdownMenuContent>
        </DropdownMenu>
    )
}