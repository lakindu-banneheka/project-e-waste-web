'use client'
import { DataTable } from "@/components/data-table";
import React, { useEffect, useState } from "react";
import { MembersCols } from "./cols";
import { useMutation } from "@tanstack/react-query";
import { getAllUsers } from "@/server/user";

const RegisterAdmin = () => {
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

    const _getAllUsers = useMutation({
        mutationFn: getAllUsers,
    });
    const  { mutate: server_getAllUsers } = _getAllUsers;

    useEffect(() => {
        server_getAllUsers();
    }, []);

    return (
        <>
            <DataTable
                columns={MembersCols}
                data={_getAllUsers.data??[]}
                isPending={_getAllUsers.isPending}
                filterOrientation="left"
                setSelectedRowIds={setSelectedUserIds}
                selectedUserIds={selectedUserIds}
            />
        </>
    );
}

export default RegisterAdmin;