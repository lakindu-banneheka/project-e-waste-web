'use client'
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getProjectById } from "@/server/project";
import { ReportWork } from "@/types/ReprotWork";
import { formatDate } from "@/utils/dateUtils";
import { useMutation } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { toast } from "sonner";


export const columns: ColumnDef<ReportWork>[] = [
  // {
  //   id: "select",
  //   header: ({ table }) => (
  //     <Checkbox
  //       checked={
  //         table.getIsAllPageRowsSelected() ||
  //         (table.getIsSomePageRowsSelected() && "indeterminate")
  //       }
  //       onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
  //       aria-label="Select all"
  //     />
  //   ),
  //   cell: ({ row }) => (
  //     <Checkbox
  //       checked={row.getIsSelected()}
  //       onCheckedChange={(value) => row.toggleSelected(!!value)}
  //       aria-label="Select row"
  //     />
  //   ),
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
      accessorKey: "projectId",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className=""
          >
            Project Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {

        const _id = row.getValue("projectId") as string;
        const { data, mutate: server_getProjectById } = useMutation({
          mutationFn: getProjectById,
          onError: (error) => {
              toast.error(error.toString());
          },
        });
  
        useEffect(() => {
            server_getProjectById({id: _id});
        },[]);
  

        return (
          <div className="capitalize text-left">
            
            {data?.name??""}
          </div>
        )
      }
  },
  {
    accessorKey: "dateSubmitted",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className=""
        >
          Date Submitted
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = row.getValue("dateSubmitted");
      const formattedDate = date?formatDate(date as Date):"";
      return (
        <div className="capitalize text-left">

          {formattedDate}
        </div>
      )
    }
  },
  {
    accessorKey: "work_minutes",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className=""
        >
          Work Hours
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {

      const work_mins = Number(row.getValue("work_minutes"));
      const hours = Math.floor(work_mins / 60); // Get whole hours
      const minutes = work_mins % 60;           // Get remaining minutes

      return (
        <div className="capitalize ">

          {`${hours} h ${minutes} min`}
        </div>
      )
    }
  },
  {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className=""
          >
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {

        return (
          <div className="capitalize text-left">
            {row.getValue("status")}
          </div>
        )
      }
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const unit = row.original

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(unit._id)}
            >
              Copy Report ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
                <Link
                    href={`/work-history/${unit._id}`}
                >
                    View Report Details
                </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
