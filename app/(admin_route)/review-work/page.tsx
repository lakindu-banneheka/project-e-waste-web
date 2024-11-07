'use client'
import { DataTable } from "@/components/data-table";
import React from "react";
import { columns } from "./columns";
import { useSession } from "next-auth/react";
import { ReportWork, ReportWork_Status } from "@/types/ReprotWork";
import { useMutation } from "@tanstack/react-query";
import { getAllReports } from "@/server/reportWork";

const ReviewWork = () => {
    const user = useSession();
    const user_Id = user.data?.user._id;
    const [workHistory,setworkHistory] = React.useState<ReportWork[]>([]);
  
    const { 
        mutate: server_getAllReports,
        data,
        isPending,
        error
    } = useMutation({
      mutationFn: getAllReports,
    });
  
    React.useEffect(() => {
      server_getAllReports();
    }, []);
  
    React.useEffect(() => {
      if(user_Id && data){
        setworkHistory(data?.filter(item => item.status === ReportWork_Status.PENDING))
      } else {
        setworkHistory([]);
      }
    },[user_Id, data]);

    return (
        <>
            <DataTable
                columns={columns}
                data={workHistory??[]}
                isPending={isPending}
            />
            <div className="h-14" ></div>
        </>
    );
}

export default ReviewWork;