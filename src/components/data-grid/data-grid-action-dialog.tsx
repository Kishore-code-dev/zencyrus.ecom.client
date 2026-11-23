import { useDataGrid } from "@/hooks/use-data-grid"
import type { PropsWithChildren } from "react"
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import DataGridToolbarMenuCloseButton from "./data-grid-toolbar-close-button"

export default function DataGridActionDialog({ children }: PropsWithChildren)
{
    const { isRender, mode, title, description } = useDataGrid()

    return (
        <AlertDialog open={isRender.open && mode == "DIALOG_FORM_DATA_GRID"}>
            <AlertDialogContent className="min-h-1/4 max-h-162.5 w-full md:min-w-2xl overflow-auto p-0">
                <AlertDialogHeader className="h-16 w-full flex flex-row items-center justify-between sticky top-0 bg-background p-3.5">
                    <div>
                        <AlertDialogTitle className="p-0 m-0">{title}</AlertDialogTitle>
                        <AlertDialogDescription className="p-0">{description}</AlertDialogDescription>
                    </div>
                    {isRender.open && <DataGridToolbarMenuCloseButton className='ml-auto' />}
                </AlertDialogHeader>
                <div className="p-5">
                    {children}
                </div>
            </AlertDialogContent>
        </AlertDialog>
    )
}
