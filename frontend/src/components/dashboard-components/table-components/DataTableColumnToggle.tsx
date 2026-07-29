import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuCheckboxItem } from "@/components/ui/dropdown-menu";
import { Button } from "@base-ui/react";
import { Table } from "@tanstack/react-table";
import { Columns3 } from "lucide-react";

interface Props<TData> {
    table: Table<TData>;
}

export function DataTableColumnToggle<TData>({
    table,
}: Props<TData>) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger render={
                <Button>
                    <Columns3 className="mr-2 h-4 w-4" />
                    Columns
                </Button>
            } />


            <DropdownMenuContent align="end">
                {table
                    .getAllLeafColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => (
                        <DropdownMenuCheckboxItem
                            key={column.id}
                            checked={column.getIsVisible()}
                            onCheckedChange={(value) =>
                                column.toggleVisibility(!!value)
                            }
                        >
                            {column.id}
                        </DropdownMenuCheckboxItem>
                    ))}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}