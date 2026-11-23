import { cn } from "@/lib/utils"
import DataGridToolbarSearchBar from "./data-grid-toolbar-search-bar"
import DataGridToolbarCreateButton from "./data-grid-toolbar-create-button"
import DataGridToolbarDeleteButton from "./data-grid-toolbar-delete-button"
// import DataGridToolbarExportDataButton from "./data-grid-toolbar-export-data-button"
import DataGridToolbarUpdateButton from "./data-grid-toolbar-update-button"
import DataGridToolbarViewSelectorButton from "./data-grid-toolbar-view-selector-button"
import type { ComponentProps } from "react"
import DataGridToolbarTitleAndDescription from "./data-grid-toolbar-title-and-description"
import { useDataGrid } from "@/hooks/use-data-grid"

interface DataGridToolbarProps extends ComponentProps<'header'>
{

}

function DataGridToolbar({ className, children, ...props }: DataGridToolbarProps)
{
    const { isRender, mode } = useDataGrid()

    if (isRender.open && mode == "DEFAULT_DATA_GRID")
    {
        return (
            <DataGridToolbarTitleAndDescription className="p-2" />
        );
    }

    if (isRender.open && mode == "INLINE_DATA_GRID")
    {
        return null
    }

    return (
        <>
            <DataGridToolbarTitleAndDescription />
            <header className={cn("h-14 w-full flex items-center justify-start gap-2 bg-background border border-border p-2", className)} {...props}>
                <DataGridToolbarCreateButton />
                <DataGridToolbarUpdateButton />
                <DataGridToolbarDeleteButton />
                <DataGridToolbarViewSelectorButton />
                <DataGridToolbarSearchBar className="ml-auto" />
            </header>
        </>
    )
}

export { DataGridToolbar }
