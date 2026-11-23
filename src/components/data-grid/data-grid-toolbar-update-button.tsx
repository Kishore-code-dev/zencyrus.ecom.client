import { Button } from "@/components/ui/button"
import { useDataGrid } from "@/hooks/use-data-grid"
import { cn } from "@/lib/utils"
import { DataGridPermissionEnum } from "@/types/data-grid"
import { Pen } from "lucide-react"
import { useCallback, useMemo, type ComponentProps } from "react"

interface DataGridToolbarMenuUpdateButtonProps extends ComponentProps<typeof Button>
{

}

export default function DataGridToolbarMenuUpdateButton({ size = "icon", variant = "outline", className, ...props }: DataGridToolbarMenuUpdateButtonProps)
{
    const { dataGridDef, permissions, setRender } = useDataGrid()
    const isHavePermission = useMemo(() => permissions.includes(DataGridPermissionEnum.UPDATE), [permissions])
    const rowSelection = dataGridDef.getState().rowSelection;
    const selectedIds: string[] = useMemo(() => Object.keys(rowSelection), [rowSelection])
    const disabled = selectedIds.length != 1
    const onClick = useCallback(() =>
    {
        setRender((pre) => ({ ...pre, open: true, id: selectedIds[0], action: "update" }))
    }, [rowSelection, selectedIds])

    if (!isHavePermission)
    {
        return null
    }

    return (
        <Button
            disabled={disabled}
            size={size}
            variant={variant}
            className={cn(className)}
            onClick={onClick}
            {...props}
        >
            <Pen />
        </Button>
    )
}
