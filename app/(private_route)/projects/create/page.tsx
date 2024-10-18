'use client'

import { AddMembers, MemberBadge } from "@/components/add-members";
import { FormFieldSimpleDatePicker } from "@/components/forms/form-field-datepicker";
import FormFieldInput from "@/components/forms/form-field-input";
import { FormFieldSelect } from "@/components/forms/form-field-select";
import { FormFieldTextarea } from "@/components/forms/form-field-textarea";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { createNewProject } from "@/server/project";
import { getAllAdmins_name_id, getAllUsers } from "@/server/user";
import { Project_Status } from "@/types/project";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";


// Form Schema
const FormSchema = z.object({
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
});

type FormSchemaType = z.infer<typeof FormSchema>;



const CreateNewProject = () => {
    const router = useRouter();
    const session = useSession();
    const user_id = session.data?.user._id || "";
    const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

    // setup form 
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
            description: ""
        },
    });

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


    // create new project query 
    const { 
        mutate: server_createNewProject,
        isPending,
        error
    } = useMutation({
        mutationFn: createNewProject,
        onSuccess: () => {
            toast.success("Project created successfully.");
            router.push('/projects');
        },
        onError(error, variables, context) {
            toast.error("Something went wrong.");
        },
    });

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

    // form submit function
    function onSubmit(data: z.infer<typeof FormSchema>) {
        if(data.members.length>data.memberCount){
            data.memberCount = data.members.length; 
        }
        const newProject = {...data}
        server_createNewProject({projectData: newProject});
        
        if(error){
            toast.error("Something went worng while creating the new project.");
            // console.log(error)
        }
        form.reset();
    }

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
                    />
                    <FormFieldSimpleDatePicker<FormSchemaType>
                        control={form.control}
                        name="startDate"
                        label="Start Date"
                        calStartDate={new Date("2000-01-01")}
                        calEndDate={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
                    />
                    <FormFieldSimpleDatePicker<FormSchemaType>
                        control={form.control}
                        name="endDate"
                        label="End Date"
                        calStartDate={new Date(form.getValues('startDate')??'2000-01-01')}
                        calEndDate={new Date(new Date().setFullYear(new Date().getFullYear() + 5))}
                    />
                    <FormFieldSelect<FormSchemaType>
                        control={form.control}
                        name="status"
                        label="Status"
                        placeholder="Select a Condition"
                        options={Object.values(Project_Status).map(item => ({ value: item, label: item.valueOf() })) || []}
                    />
                    <FormFieldInput<FormSchemaType>
                        control={form.control}
                        name="progress"
                        label="Progress"
                        placeholder="0 - 100"
                        type="number"
                    />
                    <FormFieldSelect<FormSchemaType>
                        control={form.control}
                        name="manager"
                        label="Manager"
                        placeholder="Select the project Manager"
                        options={getAdminData.data?.map(item => ({ value: item._id, label: item.name })) || []}
                        isLoadingOptions={getAdminData.isPending}
                    />
                    <FormFieldSelect<FormSchemaType>
                        control={form.control}
                        name="supervisor"
                        label="Supervisor"
                        placeholder="Select the project Supervisor"
                        options={getAdminData.data?.map(item => ({ value: item._id, label: item.name })) || []}
                        isLoadingOptions={getAdminData.isPending}
                    />
                    <FormFieldInput<FormSchemaType>
                        control={form.control}
                        name="memberCount"
                        label="Expected Member Count"
                        placeholder="Expected number of members"
                        type="number"
                    />
                    <FormFieldTextarea<FormSchemaType> 
                        name='description'
                        control={form.control}
                        label="Description"
                        placeholder="Description"
                    />
                    <div className="flex flex-col space-y-2 md:space-y-0 md:flex-row md:justify-start space-x-1 md:items-center" >
                        <div className={`mr-5 w-28 min-w-28 font-semibold text-sm`}>
                            {'Members'}
                        </div>
                        <div className="flex flex-col w-10/12 md:w-7/12 lg:w-8/12 xl:w-[70%]" >
                            <div className={`border rounded-sm w-full min-w-[210px] px-3 py-2 `}>
                                <div className="grid grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-2 w-fit" >
                                    { _getAllUsers.data?.map((member, i) => (
                                        form.getValues("members")?.includes(member._id) 
                                                ? <MemberBadge
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
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="mt-12" ></div>
                    <Button variant={'default'} className=" text-white dark:text-black" type="submit">
                        { !isPending &&
                            "Create New Project"
                        }
                        { isPending && 
                            <>
                                <p className="pl-3" >
                                    Creating...
                                </p>
                            </>
                        }    
                    </Button>
                </form>
            </Form>
            <div className="h-14" ></div>
        </div>
    );
}

export default CreateNewProject;