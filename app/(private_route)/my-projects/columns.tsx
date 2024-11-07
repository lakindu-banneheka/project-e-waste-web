"use client"
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Project } from "@/types/project";
import { ReportWorkDialog } from "@/components/custom-dialogs/report-work-dialog";

export const columns: ColumnDef<Project>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className=""
            >
              Name
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
        cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
      },
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="capitalize">{row.getValue("status")}</div>,
    },
    {
        accessorKey: "progress",
        header: ({ column }) => {
          return (
            <div className="flex justify-center" >
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                Progress
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )
        },
        cell: ({ row }) => <div className="lowercase text-center">{`${row.getValue("progress")}%`}</div>,
    },
    {
        accessorKey: "members",
        header: ({ column }) => {
          return (
            <></>
            // <Button
            //   variant="ghost"
            //   onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            // >
            //   Manager
            //   <ArrowUpDown className="ml-2 h-4 w-4" />
            // </Button>
          )
        },
        cell: ({ row }) => (
          // <div className="lowercase">
          //   {row.getValue("manager")}
          // </div>
          <></>
        ),
    },
    {
        accessorKey: "memberCount",
        header: ({ column }) => {
          return (
            <div className="flex justify-center" >
              <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              >
                Members
                <ArrowUpDown className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )
        },
        cell: ({ row }) => {
            const totalMemberCount: Number = row.getValue("memberCount");
            const currentMembers: string[] = row.getValue("members")??[];
            const currentMemberCount = currentMembers.length;
            const memberString = `${currentMemberCount} / ${totalMemberCount}`
    
            return <div className="font-medium text-center">
                {memberString}
            </div>
        },
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
                Copy project ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {/* <DropdownMenuItem>View customer</DropdownMenuItem> */}
              <DropdownMenuItem>
                <Link
                    href={`/my-projects/${unit._id}`}
                >
                    View project details
                </Link>
            </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]
