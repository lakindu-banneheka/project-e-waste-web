"use client"
import * as React from "react"
import { columns } from "./columns";
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { getAllInventoryItems } from "@/server/inventory"
import { useRouter } from "next/navigation"
import { DataTable } from "@/components/data-table"


const ViewProjectList = () => {
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

    
    const buttonDetails = {
        name: "New Project",
        onClick: () => {
            router.replace('/e-waste/projects/add-project');
        },
    };
  
    if(error){
      toast.error("Something went wrong. The projects can't be loaded. Please refresh the page.");
    }
    return (
        <div className="w-full">
            <DataTable 
                columns={columns}
                data={data??[]}
                isPending={isPending}
                buttonDetails={buttonDetails}
            />
            <div className="h-14" ></div>
        </div>
    );
}

export default ViewProjectList;