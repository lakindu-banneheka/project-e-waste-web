'use client'
import { DataTable } from "@/components/data-table";
import { getAllReports } from "@/server/reportWork";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { columns } from "./columns";

const ReportWork = () => {

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

export default ReportWork;