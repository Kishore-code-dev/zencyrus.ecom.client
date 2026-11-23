import { Table, TableBody, TableRow, TableCell, TableFooter, TableHeader } from "@/components/ui/table"
import { Skeleton } from '@/components/ui/skeleton'
import { useDataGrid } from "@/hooks/use-data-grid"
import DataGridHead from "./data-grid-head"


const SKELETON_ARRAY = Array.from({ length: 10 }).map((_, i) => (
    <TableCell key={i}>
        <Skeleton className='h-4 w-full rounded-md' />
    </TableCell>
))

export default function DataGridSkeleton()
{
    const { dataGridDef } = useDataGrid()
    return (
        <section>
            <Table>
                <TableHeader>
                    {dataGridDef.getHeaderGroups().map((headerGroup) => (
                        <TableRow key={headerGroup.id}>
                            {headerGroup.headers.map(header => (
                                <DataGridHead key={header.id} header={header} />
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    <TableRow>
                        {SKELETON_ARRAY}
                    </TableRow>
                    <TableRow>
                        {SKELETON_ARRAY}
                    </TableRow>
                    <TableRow>
                        {SKELETON_ARRAY}
                    </TableRow>
                    <TableRow>
                        {SKELETON_ARRAY}
                    </TableRow>
                    <TableRow>
                        {SKELETON_ARRAY}
                    </TableRow>
                </TableBody>
                <TableFooter>
                    <TableRow>
                        {SKELETON_ARRAY}
                    </TableRow>
                </TableFooter>
            </Table>
        </section>
    )
}
