import { Button } from "@/components/ui/button";
import { getProjectById, updateProjectById } from "@/server/project";
import { Project } from "@/types/project";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { toast } from "sonner";

export const getProjectDataBy_Id = ({_id}:{_id: string}) => {
    const { data, mutate: server_getProjectById } = useMutation({
        mutationFn: getProjectById,
        onError: (error) => {
            toast.error(error.toString());
        },
    });

    useEffect(() => {
        server_getProjectById({id: _id});
    },[]);

    return (
        <>
            {
                data?.name??""
            }
        </>
    );
}

export const getProjectDetailsById = ({_id}:{_id: string}) => {
    const { data, mutate: server_getProjectById } = useMutation({
        mutationFn: getProjectById,
        onError: (error) => {
            toast.error(error.toString());
        },
        onSuccess: () => {
            toast.success("User data successfully updated.");
            location.reload();
        },
    });

    useEffect(() => {
        server_getProjectById({id: _id});
    },[]);

    return ({data});
}


export const JoinProjectButton = ({project}:{project: Project}) => {

    const user = useSession();
    const user_Id = user.data?.user._id;

    const { data, mutate: server_updateProjectById } = useMutation({
        mutationFn: updateProjectById,
        onError: (error) => {
            toast.error(error.toString());
        },
        onSuccess: () => {
            toast.success("You have joined the group.");
            location.reload();
        },
    });

    
    return (
        <>
            <Button
                variant={'default'}
                className=" text-white dark:text-black" 
                onClick={()=>{
                    if(user_Id){
                        if(project.members.includes(user_Id)){
                            toast.error("You have already joined the group.");
                        } else if(project.memberCount <= project.members.length) {
                            toast.error("Thid project group is filled");
                        } else {
                            project.members.push(user_Id);
                            server_updateProjectById({project});
                        }
                    }
                }}
            >
                Join Project
            </Button>
        </>
    );
}