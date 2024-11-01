"use client"
import * as React from "react"
import { columns } from "./columns";
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { DataTable } from "@/components/data-table"
import { getAllProjects } from "@/server/project";


const ViewProjectList = () => {
    const router = useRouter();

    const { 
      mutate: server_getAllProjects,
      data,
      isPending,
      error
    } = useMutation({
      mutationFn: getAllProjects,
    });
  
    React.useEffect(() => {
        server_getAllProjects();
    }, []);

    
    const buttonDetails = {
        name: "New Project",
        onClick: () => {
            router.replace('/projects/create');
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
            />
            <div className="h-14" ></div>
        </div>
    );
}

export default ViewProjectList;