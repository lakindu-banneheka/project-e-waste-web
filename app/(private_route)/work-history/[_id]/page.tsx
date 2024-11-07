'use client'
import { FormFieldSimpleDatePicker } from "@/components/forms/form-field-datepicker";
import FormFieldInput from "@/components/forms/form-field-input";
import { FormFieldSelect } from "@/components/forms/form-field-select";
import { FormFieldTextarea } from "@/components/forms/form-field-textarea";
import { Form } from "@/components/ui/form";
import { getProjectById } from "@/server/project";
import { getReportById } from "@/server/reportWork";
import { ReportWork_Status } from "@/types/ReprotWork";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const FormSchema = z.object({
    _id: z.string().regex(/^[a-f\d]{24}$/i, {
        message: "",
    }),
    project_name: z.string().min(2, {
        message: "name must be at least 2 characters.",
    }),
    status: z.nativeEnum(ReportWork_Status, {
        errorMap: () => ({ message: "Invalid inventory condition" }),
    }),
    dateSubmitted: z.date(),
    description: z.string().min(2, {
        message: "description must be at least 2 characters.",
    }),
    reviewedBy: z.string(),
    workHours: z.number(),
    createdAt: z.date(),
    updatedAt: z.date(),

});
type FormSchemaType = z.infer<typeof FormSchema>;


const ReportDetails = () => {
    const router = useRouter();
    const { data } = useSession();
    const user_id = data?.user._id || "";
    const user_role = data?.user.role;
    const { _id } = useParams();
    const [projectId, setProjectId] = useState<string>();

    // setup form 
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            description: ""
        },
    });


    // get all data related to _id
    const getReportDataById = useMutation({
        mutationFn: getReportById,
        onError(error, variables, context) {
            toast.error("Something went wrong. When getting item data");
        },
    });
    const { mutate: server_getReportById } = getReportDataById;

    useEffect(() => {
        if(typeof(_id) == 'string'){
            server_getReportById({id: _id});
        }
    },[]);
    const reportData = getReportDataById?.data; 

    useEffect(() => {
        if (reportData) {
            setProjectId(reportData.projectId as string);
        }
    }, [reportData]);


    const getProjectNameById = useMutation({
        mutationFn: getProjectById,
        onError: (error) => {
          toast.error(error.toString());
        },
    });
    const { mutate: server_getProjectById } = getProjectNameById;

    useEffect(() => {
        if(projectId){
            server_getProjectById({ id: projectId });
        }
    }, [projectId, server_getProjectById]);
    

    // Default values setting - Text Fields
    useEffect(() => {
        let projectName = "";
        if (reportData) {
            if(getProjectNameById.data){
                projectName = getProjectNameById.data?.name as string;
            }
            
            form.reset({
                _id: reportData._id,
                project_name: projectName,
                createdAt: reportData.createdAt,
                updatedAt: reportData.updatedAt,
                description: reportData.description,
                dateSubmitted: reportData.dateSubmitted,
                reviewedBy: reportData.reviewedBy,
                status: reportData.status,
                workHours: reportData.work_minutes,
            });
        }
    }, [reportData, getProjectNameById.data]);

    function onSubmit(data: z.infer<typeof FormSchema>) {
        // const project = {...data}
        // server_updateProjectById({project: project});
        // form.reset();
        // setIsEditingState(false);

        // update the status
    }

    return (
        <>
            <div className="flex flex-col space-y-10 items-center mt-5" >
                <div className="w-full" >
                    <h1 className="font-semibold text-2xl text-primary" >
                        Report Details
                    </h1>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-10/12 space-y-6">
                        <FormFieldInput<FormSchemaType>
                            control={form.control}
                            name="_id"
                            label="Report ID"
                            placeholder="Report ID"
                            disabled={true}
                            isLoading={getReportDataById.isPending}
                        />
                        <FormFieldInput<FormSchemaType>
                            control={form.control}
                            name="project_name"
                            label="Project Name"
                            placeholder="Project Name"
                            disabled={true}
                            isLoading={getReportDataById.isPending}
                        />
                        <FormFieldSimpleDatePicker<FormSchemaType>
                            control={form.control}
                            name="dateSubmitted"
                            label="Date Submitted"
                            // calStartDate={new Date("2000-01-01")}
                            // calEndDate={new Date()}
                            disabled={true}
                            isLoading={getReportDataById.isPending}
                        />
                        <FormFieldInput<FormSchemaType>
                            control={form.control}
                            name="workHours"
                            label="Work Hours"
                            placeholder="Work Hours"
                            disabled={true}
                            isLoading={getReportDataById.isPending}
                        />
                        <FormFieldSelect<FormSchemaType>
                            control={form.control}
                            name="status"
                            label="Status"
                            placeholder="Select the Status"
                            options={Object.values(ReportWork_Status).map(item => ({ value: item, label: item.valueOf() })) || []}
                            disabled={true}
                            isLoading={getReportDataById.isPending}
                        />
                        <FormFieldInput<FormSchemaType>
                            control={form.control}
                            name="reviewedBy"
                            label="Reviewed By"
                            placeholder="Reviewed By"
                            disabled={true}
                            isLoading={getReportDataById.isPending}
                        />
                        <FormFieldSimpleDatePicker<FormSchemaType>
                            control={form.control}
                            name="createdAt"
                            label="Added Date"
                            // calStartDate={new Date("2000-01-01")}
                            // calEndDate={new Date()}
                            disabled={true}
                            isLoading={getReportDataById.isPending}
                        />
                        <FormFieldSimpleDatePicker<FormSchemaType>
                            control={form.control}
                            name="updatedAt"
                            label="Updated Date"
                            // calStartDate={new Date("2000-01-01")}
                            // calEndDate={new Date()}
                            disabled={true}
                            isLoading={getReportDataById.isPending}
                        />
                        <FormFieldTextarea<FormSchemaType> 
                            name='description'
                            control={form.control}
                            label="Description"
                            placeholder="Description"
                            disabled={true}
                            isLoading={getReportDataById.isPending}
                        />
                        <div className="mt-12" ></div>
                    </form>
                </Form>
                <div className="mb-16" ></div>
            </div>
        </>
    );
};

export default ReportDetails;