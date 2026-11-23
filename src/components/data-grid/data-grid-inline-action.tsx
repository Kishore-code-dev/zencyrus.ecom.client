import type { PropsWithChildren } from "react";
import DataGridToolbarTitleAndDescription from "./data-grid-toolbar-title-and-description";

export default function DataGridInlineAction({ children }: PropsWithChildren)
{
    return (
        <main className="grid grid-cols-1 gap-2.5">
            <DataGridToolbarTitleAndDescription className="p-2" />
            {children}
        </main>
    )
}
