import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "./ui/badge";
import { Checkbox } from "./ui/checkbox";
import { Button } from "./ui/button";
import { ArrowUpDown } from "lucide-react";
import { User } from "@/types/User";
import { DataTable } from "./data-table";
import { toast } from "sonner";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";

interface AddMembersProps {
    setSelectedUserIds?: React.Dispatch<React.SetStateAction<string[]>>;
    selectedUserIds?: string[];
    data: User[] | undefined;
    isPending: boolean;
    error?: Error | null
    onClickAddMembers: ()=> void;
    disabled?: boolean;
}

export const AddMembers = ({setSelectedUserIds, selectedUserIds, data, isPending, error=null, onClickAddMembers, disabled=false}: AddMembersProps) => {

    if(error){
      toast.error("Something went wrong. The Members can't be loaded. Please refresh the page.");
    }

    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant="outline" size={'sm'} disabled={disabled} >Add Members</Button>
                </DialogTrigger>
                <DialogContent className="md:max-w-fit max-h-min">
                    <DialogHeader>
                        <DialogTitle>Add Members</DialogTitle>
                    </DialogHeader>
                    <ScrollArea className="h-96 px-5">
                        <div className="flex items-center space-x-2 ">
                            <DataTable
                                columns={AddMembersCols}
                                data={data??[]}
                                isPending={isPending}
                                filterOrientation="left"
                                setSelectedRowIds={setSelectedUserIds}
                                selectedUserIds={selectedUserIds}
                            />
                        </div>
                        <ScrollBar orientation="horizontal" />
                    </ScrollArea>
                    <DialogFooter className="sm:justify-start">
                        <DialogClose>
                            <Button type="button" variant="secondary">
                                Close
                            </Button>
                        </DialogClose>
                        <DialogClose>
                            <Button 
                                type="button" 
                                variant="default" 
                                className="mb-3 font-semibold"
                                onClick={onClickAddMembers}
                            >
                                {`Add (${selectedUserIds?.length??0})`}
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
};


const AddMembersCols: ColumnDef<User>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
        accessorKey: "firstName",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className=""
            >
              First Name
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
        cell: ({ row }) => <div className="capitalize text-left">{row.getValue("firstName")}</div>,
    },
    {
        accessorKey: "lastName",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className=""
            >
              Last Name
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
        cell: ({ row }) => <div className="capitalize text-left">{row.getValue("lastName")}</div>,
    },
    {
        accessorKey: "email",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className=""
            >
              Email
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
        cell: ({ row }) => <div className="lowercase text-left">{row.getValue("email")}</div>,
    },
    {
        accessorKey: "universityId",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className=""
            >
              University ID
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
        cell: ({ row }) => <div className=" text-center">{row.getValue("universityId")}</div>,
    },
    {
        accessorKey: "phoneNo",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
              className=""
            >
              Phone Number
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          )
        },
        cell: ({ row }) => <div className="lowercase text-center">{row.getValue("phoneNo")}</div>,
    },
  ]


export const MemberBadge = ({firstName, lastName}:{firstName: string, lastName: string}) => {

    return (
        <>
            <Badge variant={'secondary'} className="text-center text-xs pl-3 h-5 cursor-pointer w-fit m-0" >
                <div>
                    {`${firstName} ${lastName}`}
                </div>
            </Badge>
        </>
    );
} 