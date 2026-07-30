import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface DataTableSkeletonProps {
    columnCount?: number;
    rowCount?: number;
}

export function DataTableSkeleton({
    columnCount = 5,
    rowCount = 6,
}: DataTableSkeletonProps) {
    return (

        <Table className="mb-4 overflow-hidden rounded-md border">
            <TableHeader>
                <TableRow>
                    {Array.from({ length: columnCount }).map((_, i) => (
                        <TableHead key={i}>
                            <Skeleton className="h-5 w-24" />
                        </TableHead>
                    ))}
                </TableRow>
            </TableHeader>
            <TableBody>
                {Array.from({ length: rowCount }).map((_, rowIndex) => (
                    <TableRow key={rowIndex}>
                        {Array.from({ length: columnCount }).map((_, cellIndex) => (
                            <TableCell key={cellIndex}>
                                <Skeleton className="h-6 w-full max-w-30" />
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>

    )
}