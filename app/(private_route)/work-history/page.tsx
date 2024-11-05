'use client'
import { DataTable } from "@/components/data-table";
import { getAllReports } from "@/server/reportWork";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { columns } from "./columns";
import { ReportWork } from "@/types/ReprotWork";
import { useSession } from "next-auth/react";

const Report_Work = () => {
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
      setworkHistory(data?.filter(item => item.userId === user_Id))
    } else {
      setworkHistory([]);
    }
  },[user_Id, data]);

    return(
        <>
            <DataTable
                columns={columns}
                data={data??[]}
                isPending={isPending}
            />
            <div className="h-14" ></div>
        </>
    );
}

export default Report_Work;