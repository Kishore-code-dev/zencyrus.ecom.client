import { Button } from "@/components/ui/button"
import { useDataGrid } from "@/hooks/use-data-grid"
import { cn } from "@/lib/utils"
import { DataGridPermissionEnum } from "@/types/data-grid"
import { X } from "lucide-react"
import { useCallback, useMemo, type ComponentProps } from "react"

interface DataGridToolbarMenuCloseButtonProps extends ComponentProps<typeof Button>
{

}

export default function DataGridToolbarMenuCloseButton({ size = "icon", variant = "outline", className, ...props }: DataGridToolbarMenuCloseButtonProps)
{
    const { permissions, setRender, dataGridDef } = useDataGrid()
    const isHavePermission = useMemo(() => permissions.includes(DataGridPermissionEnum.UPDATE) || permissions.includes(DataGridPermissionEnum.CREATE), [permissions])

    if (!isHavePermission)
    {
        return null
    }

    const onClick = useCallback(() =>
    {
        setRender((pre) => ({ ...pre, open: false, action: "none", id: "" }))
        dataGridDef.setRowSelection({})

    }, [])


    return (
        <Button
            size={size}
            variant={variant}
            className={cn(className)}
            onClick={onClick}
            {...props}
        >
            <X />
        </Button>
    )
}
