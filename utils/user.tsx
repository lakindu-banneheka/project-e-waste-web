'use client'
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { updateUserById } from "@/server/user";
import { User, UserRole } from "@/types/User";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const UpdateUser = ({ unit }: { unit: User }) => {

    const update_UserById = useMutation({
        mutationFn: updateUserById,
        onError: (error) => {
            toast.error(error.toString());
        },
        onSuccess: () => {
            toast.success("User data successfully updated.");
            location.reload();
        },
    });

    const { mutate: server_UpdateUserById } = update_UserById;

    const handleUpdateUser = () => {
        const updatedUnit = { ...unit };
        updatedUnit.role =
        unit.role === UserRole.Admin ? UserRole.Contributor : UserRole.Admin;

        server_UpdateUserById({ user: updatedUnit });
    };

    return (
        // <button onClick={handleUpdateUser}>
        //   Update User Role
        // </button>
        <DropdownMenuItem
            onClick={handleUpdateUser}
        >
            {
            unit.role === UserRole.Contributor ? "Promote To Admin" :(
                unit.role === UserRole.Admin ? "To Contributor" : ""
            )
            }
        </DropdownMenuItem>
    );
};
