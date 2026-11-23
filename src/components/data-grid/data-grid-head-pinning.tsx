import { DropdownMenuItem, DropdownMenuSeparator, DropdownMenuGroup, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import type { RowData } from "@/types/common";
import type { Header } from "@tanstack/react-table";
import { useMemo, type ComponentProps } from "react";
import { Pin, PinOff } from "lucide-react";
import { cn } from "@/lib/utils";

interface DataGridHeadPinningProps extends ComponentProps<typeof DropdownMenuGroup>
{
    header: Header<RowData, unknown>
}

export default function DataGridHeadPinning(props: DataGridHeadPinningProps)
{

    const { header, className } = props
    const isCanPinned = useMemo(() => header.column.getCanPin(), [header.column])

    if (!isCanPinned)
    {
        return null;
    }

    return (
        <DropdownMenuGroup className={cn(className)} {...props}>
            <DropdownMenuCheckboxItem
                className="relative pr-8 pl-2 [&>span:first-child]:right-2 [&>span:first-child]:left-auto [&_svg]:text-muted-foreground"
                checked={header.column.getIsPinned() == "left"}
                onClick={() => header.column.pin("left")}
            >
                <Pin className="rotate-45" />
                Pin to Left
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
                className="relative pr-8 pl-2 [&>span:first-child]:right-2 [&>span:first-child]:left-auto [&_svg]:text-muted-foreground"
                checked={header.column.getIsPinned() == "right"}
                onClick={() => header.column.pin("right")}
            >
                <Pin className="-rotate-45" />
                Pin to Right
            </DropdownMenuCheckboxItem>
            {header.column.getIsPinned() && (
                <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => header.column.pin(false)}>
                        <PinOff />
                        No Pin
                    </DropdownMenuItem>
                </>
            )}
        </DropdownMenuGroup>
    )
}