'use client'

import { AddMembers, MemberBadge } from "@/components/add-members";
import { ConfirmationDialog } from "@/components/custom-dialogs/confirmation-dialog";
import { FormFieldSimpleDatePicker } from "@/components/forms/form-field-datepicker";
import FormFieldInput from "@/components/forms/form-field-input";
import { FormFieldSelect } from "@/components/forms/form-field-select";
import { FormFieldTextarea } from "@/components/forms/form-field-textarea";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { deleteProjectById, getProjectById, updateProjectById } from "@/server/project";
import { getAllAdmins_name_id, getAllUsers } from "@/server/user";
import { Project_Status } from "@/types/project";
import { UserRole } from "@/types/User";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";


// Form Schema
const FormSchema = z.object({
    _id: z.string(),
    name: z.string().min(2, {
        message: "name must be at least 2 characters.",
    }),
    startDate: z.date(),
    endDate: z.date(),
    status: z.nativeEnum(Project_Status, {
        errorMap: () => ({ message: "Invalid inventory type." }),
    }),
    progress: z.preprocess(
        (val) => (typeof val === 'string' ? parseFloat(val) : val),
        z.number().min(0, "Progress must be at least 0").max(100, "Progress cannot exceed 100")
    ),
    manager: z.string().regex(/^[a-f\d]{24}$/i, {
        message: "Select an admin",
    }),
    members: z.array(
        z.string().regex(/^[a-f\d]{24}$/i, {
            message: "Select Contributors",
        })
    ),
    supervisor: z.string().regex(/^[a-f\d]{24}$/i, {
        message: "Select an admin",
    }),
    memberCount: z.preprocess(
        (val) => (typeof val === 'string' ? parseInt(val, 10) : val),
        z.number().min(0, 'Member count must be at least 0')
    ),
    description: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),
});

type FormSchemaType = z.infer<typeof FormSchema>;



const ProjectDetails = () => {
    const router = useRouter();
    const session = useSession();
    const user_id = session.data?.user._id || "";
    const user_role = session.data?.user.role;
    const { _id } = useParams();
    const [isEditingState, setIsEditingState] = useState<boolean>(false);

    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

    // setup form 
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
            description: ""
        },
    });


    // get all data related to _id
    const _getProjectById = useMutation({
        mutationFn: getProjectById,
        onError(error, variables, context) {
            toast.error("Something went wrong. When getting item data");
        },
    });
    const { mutate: server_getProjectById } = _getProjectById;

    useEffect(() => {
        console.log(_id, 'id ');
        if(typeof(_id) == 'string'){
            server_getProjectById({id: _id});
        }
    },[]);
    const ProjectData = _getProjectById?.data; 

    // get all the admin data for select
    const getAdminData = useMutation({
        mutationFn: getAllAdmins_name_id,
        onError(error, variables, context) {
            toast.error("Something went wrong.");
        },
    });

    const { mutate: server_getAllAdmins_name_id } = getAdminData;

    useEffect(() => {
        server_getAllAdmins_name_id();
    },[]);




    // getAll Member data
    const _getAllUsers = useMutation({
        mutationFn: getAllUsers, // create a basic user type then try again
    });
    const  { mutate: server_getAllUsers } = _getAllUsers;

    useEffect(() => {
        server_getAllUsers();
    }, []);

    const onClickAddMembers = () => {
        form.setValue("members",selectedUserIds);
        setSelectedUserIds([]);
    }

    useEffect(() => {
        setSelectedUserIds(form.getValues("members"));
    }, [form.getValues("members")]);

    const update_ProjectById = useMutation({
        mutationFn: updateProjectById,
        onError(error, variables, context) {
            toast.error("Something went wrong. When updating items");
        },
        onSuccess() {
            if(typeof(_id) == 'string'){
                server_getProjectById({id: _id});
            }
        }
    });
    const { mutate: server_updateProjectById } = update_ProjectById;

    function onSubmit(data: z.infer<typeof FormSchema>) {
        const project = {...data}
        server_updateProjectById({project: project});
        form.reset();
        setIsEditingState(false);
    }

    // Delete Project
    const delete_ProjectById = useMutation({
        mutationFn: deleteProjectById,
        onError(error, variables, context) {
            toast.error(error.toString());
        },
        onSuccess() {
            if(typeof(_id) == 'string'){
                router.push('/projects');
                toast.success("Inventory Item successfully deleted.");
            }
        }
    });
    const { mutate: server_deleteProjectById } = delete_ProjectById;

    function onDelete() {
        if(typeof(_id) == 'string'){
            server_deleteProjectById({id: _id});
        } else {
            toast.error("Multiple items can't be deleted at onece");
        }
    };

        // Default values setting - Text Fields
        useEffect(() => {
            if (ProjectData) {
                form.reset({
                    _id: ProjectData._id,
                    name: ProjectData.name as string,
                    progress: ProjectData.progress,
                    memberCount: ProjectData.memberCount,
                    startDate: ProjectData.startDate,
                    endDate: ProjectData.endDate,
                    description: ProjectData.description as string,
                    createdAt: ProjectData.createdAt,
                    updatedAt: ProjectData.updatedAt,
                    members: ProjectData.members as string[],
                    manager: ProjectData.manager as string,
                    status: ProjectData.status
                });
            }
        }, [ProjectData]);
    
        useEffect(()=> {
            if(ProjectData){
                form.setValue("status", ProjectData.status);
                form.setValue("supervisor", ProjectData.supervisor as string);
                form.setValue("manager", ProjectData.manager as string);
            }
        },[_getProjectById.isSuccess, ProjectData, _getAllUsers.isSuccess]);

    useEffect(() => {
        if(Object.keys(form.formState.errors).length > 0){
            toast.error("Please fill all the fields correctly!");
        }
        return () => {}
    },[form.formState.isSubmitting])

    return (
        <div className="flex flex-col space-y-10 items-center mt-5" >
            <div className="w-full" >
                <h1 className="font-semibold text-2xl text-primary" >
                    Create New Project
                </h1>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-10/12 space-y-6">
                    <FormFieldInput<FormSchemaType>
                        control={form.control}
                        name="name"
                        label="Name"
                        placeholder="Name"
                        disabled={!isEditingState}
                        isLoading={_getProjectById.isPending}
                    />
                    <FormFieldSimpleDatePicker<FormSchemaType>
                        control={form.control}
                        name="startDate"
                        label="Start Date"
                        calStartDate={new Date("2000-01-01")}
                        calEndDate={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
                        disabled={!isEditingState}
                        isLoading={_getProjectById.isPending}
                    />
                    <FormFieldSimpleDatePicker<FormSchemaType>
                        control={form.control}
                        name="endDate"
                        label="End Date"
                        calStartDate={new Date(form.getValues('startDate')??'2000-01-01')}
                        calEndDate={new Date(new Date().setFullYear(new Date().getFullYear() + 5))}
                        disabled={!isEditingState}
                        isLoading={_getProjectById.isPending}
                    />
                    <FormFieldSelect<FormSchemaType>
                        control={form.control}
                        name="status"
                        label="Status"
                        placeholder="Select a Condition"
                        options={Object.values(Project_Status).map(item => ({ value: item, label: item.valueOf() })) || []}
                        disabled={!isEditingState}
                        isLoading={_getProjectById.isPending}
                    />
                    <FormFieldInput<FormSchemaType>
                        control={form.control}
                        name="progress"
                        label="Progress"
                        placeholder="0 - 100"
                        type="number"
                        disabled={!isEditingState}
                        isLoading={_getProjectById.isPending}
                    />
                    <FormFieldSelect<FormSchemaType>
                        control={form.control}
                        name="manager"
                        label="Manager"
                        placeholder="Select the project Manager"
                        options={getAdminData.data?.map(item => ({ value: item._id, label: item.name })) || []}
                        isLoadingOptions={getAdminData.isPending}
                        disabled={!isEditingState}
                        isLoading={_getProjectById.isPending || _getAllUsers.isPending}
                    />
                    <FormFieldSelect<FormSchemaType>
                        control={form.control}
                        name="supervisor"
                        label="Supervisor"
                        placeholder="Select the project Supervisor"
                        options={getAdminData.data?.map(item => ({ value: item._id, label: item.name })) || []}
                        isLoadingOptions={getAdminData.isPending}
                        disabled={!isEditingState}
                        isLoading={_getProjectById.isPending || _getAllUsers.isPending}
                    />
                    <FormFieldInput<FormSchemaType>
                        control={form.control}
                        name="memberCount"
                        label="Expected Member Count"
                        placeholder="Expected number of members"
                        type="number"
                        disabled={!isEditingState}
                        isLoading={_getProjectById.isPending}
                    />
                    <FormFieldTextarea<FormSchemaType> 
                        name='description'
                        control={form.control}
                        label="Description"
                        placeholder="Description"
                        disabled={!isEditingState}
                        isLoading={_getProjectById.isPending}
                    />
                    <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:justify-start space-x-1 md:items-center" >
                        <div className={`mr-5 w-28 min-w-28 font-semibold text-sm`}>
                            {'Members'}
                        </div>
                        <div className="flex flex-col w-10/12 md:w-7/12 lg:w-8/12 xl:w-[70%]" >
                            { _getProjectById.isPending || _getAllUsers.isPending
                                ?  <Skeleton className="w-full h-10" />
                                :<div className={`border rounded-sm w-full min-w-[210px] px-3 py-2 `}>
                                    <div className="grid grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2 w-fit" >
                                        { _getAllUsers.data?.map((member, i) => (
                                            form.getValues("members")?.includes(member._id) 
                                                    ? <MemberBadge
                                                        key={i}
                                                        firstName={member.firstName}
                                                        lastName={member.lastName}
                                                    />
                                                :<></>
                                        ))}
                                    </div>
                                    <div className="w-full flex justify-end" >
                                        <AddMembers 
                                            setSelectedUserIds={setSelectedUserIds}
                                            selectedUserIds={selectedUserIds}
                                            isPending={_getAllUsers.isPending}
                                            data={_getAllUsers.data}
                                            error={_getAllUsers.error}
                                            onClickAddMembers={onClickAddMembers}
                                            disabled={!isEditingState}
                                        />
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                    <div className="mt-12" ></div>
                    <div className="flex flex-row justify-start items-center space-x-5" >
                            <>
                                { !isEditingState &&
                                    <Button 
                                        variant={'default'} 
                                        className=" text-white dark:text-black" 
                                        type={isEditingState?"submit":"button"}
                                        onClick={(e)=>{
                                            e.preventDefault();
                                            if(user_role == UserRole.Admin){
                                                setIsEditingState(true);
                                            } else {
                                                toast.error("You have to be an admin to update item data.")
                                            }
                                        }}    
                                    >
                                        Update Project
                                    </Button>
                                }
                                { isEditingState &&
                                    <Button variant={'default'} className=" text-white dark:text-black" type={isEditingState?"submit":"button"}   
                                    >
                                        { !update_ProjectById.isPending &&
                                            "Save Updated data"
                                        }
                                        { update_ProjectById.isPending && 
                                            "Updating..."
                                        }    
                                    </Button>
                                }
                            </>  
                            
                            <ConfirmationDialog
                                triggerBtnLable="Delete"
                                confirmationTopic="Do you want to delete this Project ?"
                                confirmationDescription="This action cannot be undone. This will permanently delete project data from our servers."
                                confirmBtnLable={
                                    !delete_ProjectById.isPending ? "Delete" : "Deleting..."
                                }
                                confirmBtnVarient="destructive"
                                triggerBtnVarient={'destructive'}
                                onConfirm={onDelete}
                                disabled={user_role != UserRole.Admin}
                            />
                        </div>
                </form>
            </Form>
            <div className="h-14" ></div>
        </div>
    );
}

export default ProjectDetails;