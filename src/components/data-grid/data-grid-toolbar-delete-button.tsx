import { Button } from "@/components/ui/button"
import { useDataGrid } from "@/hooks/use-data-grid"
import { cn } from "@/lib/utils"
import { DataGridPermissionEnum } from "@/types/data-grid"
import { Trash2 } from "lucide-react"
import { useCallback, useMemo, useState, useTransition, type ComponentProps } from "react"
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel } from "@/components/ui/alert-dialog"
import { Spinner } from "@/components/ui/spinner"
import { useApiAction } from "@/hooks/use-api-action"
import { AxiosError } from "axios"
import { api } from "@/config/api"

interface DataGridToolbarMenuDeleteButtonProps extends ComponentProps<typeof Button>
{

}

export default function DataGridToolbarMenuDeleteButton({ size = "icon", variant = "outline", className, ...props }: DataGridToolbarMenuDeleteButtonProps)
{
    const { dataGridDef, permissions, submissionUrl, fetchPagedResultAsync, payload } = useDataGrid()
    const isHavePermission = useMemo(() => permissions.includes(DataGridPermissionEnum.DELETE), [permissions])
    const rowSelection = dataGridDef.getState().rowSelection;
    const selectedIds: string[] = useMemo(() => Object.keys(rowSelection), [rowSelection])
    const disabled = selectedIds.length != 1
    const [loading, startTransition] = useTransition()
    const { apiActionAsync } = useApiAction()
    const [open, setOpen] = useState<boolean>(false)
    const onDelete = useCallback(() =>
    {
        startTransition(async () =>
        {
            try
            {
                const response = await api.delete(`${submissionUrl}/delete?id=${selectedIds[0]}`)
                if (response.status == 200 && response.data)
                {
                    await fetchPagedResultAsync({ ...payload, pageNumber: 1 })
                }
            } catch (error)
            {
                if (error instanceof AxiosError && error.response)
                {
                    await apiActionAsync(error.response)
                }
            }
            finally
            {
                setOpen(false)
                dataGridDef.setRowSelection({})
            }
        })
    }, [selectedIds])

    if (!isHavePermission)
    {
        return null
    }

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button
                    disabled={disabled}
                    size={size}
                    variant={variant}
                    className={cn(className, "text-destructive! hover:bg-muted")}
                    {...props}
                >
                    <Trash2 />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete {selectedIds.length} {selectedIds.length === 1 ? 'item' : 'items'}?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the selected {selectedIds.length === 1 ? 'item' : 'items'} from the system.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <div className="flex items-center justify-end gap-2">
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <Button disabled={loading} onClick={onDelete} variant='destructive'>
                        {loading && <Spinner />} Delete
                    </Button>
                </div>
            </AlertDialogContent>
        </AlertDialog>
    )
}