"use client"
import * as React from "react"
import { columns } from "./columns";
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { DataTable } from "@/components/data-table"
import { getAllProjects, Res_Project } from "@/server/project";
import { useSession } from "next-auth/react";


const ViewProjectList = () => {
    const user = useSession();
    const user_Id = user.data?.user._id;
    const [myProjectList,setMyProjectList] = React.useState<Res_Project[]>([]);
    
   

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

    React.useEffect(() => {
        if(user_Id && data){
            setMyProjectList(data?.filter(item => item.members.includes(user_Id)))
        } else {
            setMyProjectList([]);
        }
    },[user_Id, data]);

    if(error){
      toast.error("Something went wrong. The projects can't be loaded. Please refresh the page.");
    }
    return (
        <div className="w-full">
            <DataTable
                columns={columns}
                data={myProjectList}
                isPending={isPending}
            />
            <div className="h-14" ></div>
        </div>
    );
}

export default ViewProjectList;