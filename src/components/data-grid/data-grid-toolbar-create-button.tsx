import { Button } from "@/components/ui/button"
import { useDataGrid } from "@/hooks/use-data-grid"
import { cn } from "@/lib/utils"
import { DataGridPermissionEnum } from "@/types/data-grid"
import { Plus } from "lucide-react"
import { useCallback, useMemo, type ComponentProps } from "react"

interface DataGridToolbarMenuCreateButtonProps extends ComponentProps<typeof Button>
{

}

export default function DataGridToolbarMenuCreateButton({ size = "icon", variant = "outline", className, ...props }: DataGridToolbarMenuCreateButtonProps)
{
    const { dataGridDef, permissions, setRender, isRender } = useDataGrid()
    const isHavePermission = useMemo(() => permissions.includes(DataGridPermissionEnum.CREATE), [permissions])
    const rowSelection = dataGridDef.getState().rowSelection;
    const selectedIds: string[] = useMemo(() => Object.keys(rowSelection), [rowSelection])
    const disabled = selectedIds.length != 0;

    const onClick = useCallback(() =>
    {
        setRender((pre) => ({ ...pre, open: true, action: "create" }))
    }, [isRender, setRender])

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
            <Plus />
        </Button>
    )
}
