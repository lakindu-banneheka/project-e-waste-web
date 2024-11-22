'use client'
import { DataTable } from "@/components/data-table";
import { getAllRecoveredItems } from "@/server/recoveredItems";
import { useMutation } from "@tanstack/react-query";
import React from "react";
import { columns } from "./columns";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { UserRole } from "@/types/User";

const RecoveredItems = () => {
    const router = useRouter();
    const user = useSession();
    const user_role = user.data?.user.role || "";

    const { 
        mutate: server_getAllReports,
        data,
        isPending,
        error
    } = useMutation({
      mutationFn: getAllRecoveredItems,
    });
  
    React.useEffect(() => {
      server_getAllReports();
    }, []);

    const buttonDetails = {
        name: "New Type",
        onClick: () => {
            router.replace('/e-waste/recovered-items/add-type');
        },
    };


    return (
        <>
            <DataTable
                columns={columns}
                data={data??[]}
                isPending={isPending}
                buttonDetails={user_role===UserRole.Admin?buttonDetails:undefined}
            />
            <div className="h-14" ></div>
        </>
    );
} 

export default RecoveredItems;