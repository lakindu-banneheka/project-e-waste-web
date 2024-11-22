'use client'
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { getInventoryItemById } from "@/server/inventory";
import { RecoveryLogs } from "@/types/recovered-items";
import { formatDate } from "@/utils/dateUtils";
import { useMutation } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { toast } from "sonner";

const ItemNameCell = ({ id }: { id: string }) => {
  const { data, mutate: server_getItemById } = useMutation({
    mutationFn: getInventoryItemById,
    onError: (error) => {
      toast.error(error.toString());
    },
  });

  useEffect(() => {
    if(id != ""){
      server_getItemById({ id: id });
    }
  }, [id, server_getItemById]);

  return <div className="capitalize text-left">{id===""? "":(data?.name ?? "")}</div>;
};

export const columns: ColumnDef<RecoveryLogs>[] = [
  // {
  //   accessorKey: "id",
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant="ghost"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //         className="text-center"
  //       >
  //         ID
  //         <ArrowUpDown className="ml-2 h-4 w-4" />
  //       </Button>
  //     )
  //   },
  //   cell: ({ row }) => {
  //     return (
  //       <div className="capitalize text-left">
  //         {row.getValue("id")}
  //       </div>
  //     )
  //   }
  // },
  {
    accessorKey: "inventoryAction",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="items-center"
        >
          Action Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return (
        <div className="text-left mr-8">
          {row.getValue("inventoryAction")}
        </div>
      )
    }
  },
  {
    accessorKey: "no_of_items",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="items-center"
        >
          No.Of Items
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      return (
        <div className="text-center mr-8">
          {row.getValue("no_of_items")}
        </div>
      )
    }
  },
  {
    accessorKey: "recovered_date",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="items-center"
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const date = row.getValue("recovered_date");
      const formattedDate = date?formatDate(date as Date):"";
      return (
        <div className="text-center">
          {formattedDate}
        </div>
      )
    }
  },
  {
    accessorKey: "ewaste_unit_id",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className=""
        >
          Recovered From
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => {
      const id = row.getValue("ewaste_unit_id") as string;
      
      return (<ItemNameCell id={id} />);
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
              onClick={() => navigator.clipboard.writeText(unit.id??"")}
            >
              Copy Item type ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
                {/* a way to open the dialog for more details but also have to loard all the details to update the data -- need a fix */}
            </DropdownMenuItem>
            {/* <DropdownMenuItem>
                <Link
                    href={`/e-waste/recovered-items/${unit._id}`}
                >
                    Add Item
                </Link>
            </DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
