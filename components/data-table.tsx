"use client"
import * as React from "react"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  ColumnDef,
  flexRender,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { tableLoadingAnimation } from "./loading-skeletons/table-loading-skeleton"
import { Button } from "./ui/button"
import { SearchFilterComponent } from "./search-filter"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isPending: boolean;
  buttonDetails?: {
    name: string;
    onClick: () => void;
  }
  filterOrientation?: 'left' | 'right';
  setSelectedRowIds?: React.Dispatch<React.SetStateAction<string[]>>;
  selectedUserIds?: string[];
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isPending,
  buttonDetails,
  filterOrientation='right',
  setSelectedRowIds,
  selectedUserIds,
}: DataTableProps<TData, TValue>) {

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
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

  // Monitor row selection changes
  React.useEffect(() => {
    const selectedRows = table.getSelectedRowModel().rows.map(row => row.original);
    const selectedRowIds = selectedRows.map((row) => (row as { _id: string })._id); // Assert type
    setSelectedRowIds!=undefined?setSelectedRowIds(selectedRowIds):null;
  }, [rowSelection]);

  // React.useEffect(() => {
  //   // update the rows

  // },[selectedUserIds]);

  // Update rowSelection based on selectedUserIds array
React.useEffect(() => {
  console.log('123 run')
  if (selectedUserIds && selectedUserIds.length > 0) {
    // Calculate rows to be selected based on selectedUserIds
    const updatedSelection: Record<string, boolean> = {};

    data.forEach((row, index) => {
      const rowId = (row as { _id: string })._id; // Ensure _id exists
      if (selectedUserIds.includes(rowId)) {
        updatedSelection[index] = true; // Select rows not in selectedUserIds
      }
    });

    setRowSelection(updatedSelection); // Update the rowSelection state with the filtered IDs
  } else {
    setRowSelection({}); // Clear selection if no selectedUserIds
  }
}, []);


  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4 px-3">
        { buttonDetails
          ? <Button
              className="text-black dark:text-white font-normal mr-5" 
              onClick={buttonDetails.onClick}
            >
              {buttonDetails.name || ""}
            </Button>
          : filterOrientation=='right'?<div></div>:<></>
        }
        <SearchFilterComponent
            table={table}
        />
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
                    tableLoadingAnimation({noOfCols: headerGroup.headers.length, noOfRows: 6})
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
    </div>
  )
}