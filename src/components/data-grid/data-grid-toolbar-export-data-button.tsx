import { Button } from "@/components/ui/button"
import { useDataGrid } from "@/hooks/use-data-grid"
import { cn } from "@/lib/utils"
import { DataGridPermissionEnum } from "@/types/data-grid"
import { Download } from "lucide-react"
import { useMemo, type ComponentProps } from "react"

interface DataGridToolbarMenuExportDataButtonProps extends ComponentProps<typeof Button>
{

}

export default function DataGridToolbarMenuExportDataButton({ size = "icon", variant = "outline", className, ...props }: DataGridToolbarMenuExportDataButtonProps)
{
    const { permissions } = useDataGrid()
    const isHavePermission = useMemo(() => permissions.includes(DataGridPermissionEnum.EXPORT_DATA), [permissions])

    if (!isHavePermission)
    {
        return null
    }

    return (
        <Button
            size={size}
            variant={variant}
            className={cn(className)}
            {...props}
        >
            <Download />
        </Button>
    )
}
