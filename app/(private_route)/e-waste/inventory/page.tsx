"use client"

import * as React from "react"
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { columns } from "./columns";
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { getAllInventoryItems } from "@/server/inventory"
import { tableLoadingAnimation } from "@/components/loading-skeletons/table-loading-skeleton"
import { useRouter } from "next/navigation"
import { SearchFilterComponent } from "@/components/search-filter"

export default function DataTableDemo() {

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const router = useRouter();
  const { 
    mutate: server_getAllInventoryItems,
    data,
    isPending,
    error
  } = useMutation({
    mutationFn: getAllInventoryItems,
  });

  React.useEffect(() => {
    server_getAllInventoryItems();
  }, []);

  const table = useReactTable({
    data: data??[],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  if(error){
    toast.error("Something went wrong. The inventory can't be loaded. Please refresh the page.");
  }

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4">
        <div>
          <Button 
            className="text-black dark:text-white font-normal mr-5" 
            onClick={()=>{
              router.replace('/e-waste/inventory/add-item')
            }}
          >
            Add Item
          </Button>
        </div>
        <div >
          <SearchFilterComponent 
            table={table}
          />
        </div>
      </div>
      <div className="rounded-md border w-full">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            { isPending &&                      // for skeleton when loading (loading animation)
              table.getHeaderGroups().map((headerGroup) => ( 
                tableLoadingAnimation({noOfCols: headerGroup.headers.length, noOfRows: 10})
              ))                 
            }
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : ( !isPending &&
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
      <div className="h-14" ></div>
    </div>
  )
}
