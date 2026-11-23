import { Button } from "@/components/ui/button"
import { Combobox } from "@/components/ui/combobox"
import { useDataGrid } from "@/hooks/use-data-grid"
import { cn } from "@/lib/utils"
import { DataGridPermissionEnum } from "@/types/data-grid"
import { View } from "lucide-react"
import { useMemo, type ComponentProps } from "react"

interface DataGridToolbarMenuViewSelectorButtonProps extends ComponentProps<typeof Button>
{

}

export default function DataGridToolbarMenuViewSelectorButton({ size = "icon", variant = "outline", className, ...props }: DataGridToolbarMenuViewSelectorButtonProps)
{
    const { permissions, payload } = useDataGrid()
    const isHavePermission = useMemo(() => permissions.includes(DataGridPermissionEnum.VIEW_SELECT), [permissions])

    if (!isHavePermission)
    {
        return null
    }

    return (
        <Combobox
            path={`views/search?parentViewId=${payload.viewId}&searchString`}
            mode="dynamic"
        >
            <Button
                size={size}
                variant={variant}
                className={cn(className)}
                {...props}
            >
                <View />
            </Button>
        </Combobox>
    )
}
