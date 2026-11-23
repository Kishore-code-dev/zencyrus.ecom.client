import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"

function DataGridContentSkeleton()
{
    return (
        <div className="w-full bg-background overflow-auto" style={{ scrollbarWidth: 'thin' }}>
            <div className='[&>div]:max-h-screen [&>div]:rounded-sm [&>div]:border bg-background'>
                <Table>
                    <TableHeader>
                        <TableRow aria-label="table-skeleton">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <TableHead aria-label="table-skeleton" key={i}>
                                    <Skeleton className="h-5" />
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {Array.from({ length: 5 }).map((_, i) => (
                            <TableRow aria-label="table-skeleton" key={i}>
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <TableCell aria-label="table-skeleton" key={i}>
                                        <Skeleton className="h-4" />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}

export default DataGridContentSkeleton