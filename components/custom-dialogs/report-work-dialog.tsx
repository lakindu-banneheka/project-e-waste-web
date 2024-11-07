'use client'
import React, { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import { Form } from "../ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import FormFieldInput from "../forms/form-field-input";
import { FormFieldSimpleDatePicker } from "../forms/form-field-datepicker";
import { FormFieldTextarea } from "../forms/form-field-textarea";
import { useSession } from "next-auth/react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { getUserDataById } from "@/server/user";
import { ReportNewWork } from "@/server/reportWork";
import { ReportWork_BaseType, ReportWork_Status } from "@/types/ReprotWork";


const FormSchema = z.object({
    studentNo: z.string(),
    project_name: z.string(),
    dateSubmitted: z.date(),
    workMins: z.string(),
    description: z.string().min(2, {
        message: "description must be at least 2 characters.",
    }),
});
type FormSchemaType = z.infer<typeof FormSchema>;



export const ReportWorkDialog = ({project_name, project_id}:{project_name: string, project_id: string}) => {

    const user = useSession();
    const user_Id = user.data?.user._id;
    const [open, setOpen] = useState(false);

    const userData = useMutation({
        mutationFn: getUserDataById,
        onError: (error) => {
            toast.error(error.toString());
        },
        onSuccess: () => {
 
        },
    });
    
    const { mutate: server_getUserById } = userData;

    React.useEffect(() => {
        if(user_Id){
            server_getUserById({_id: user_Id});
        }
    },[user_Id]);

    // setup form 
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            description: "",
            studentNo: "",
            project_name: "",
            dateSubmitted: new Date(),
            // workMins: '0',
        },
    });

    useEffect(() => {
        form.setValue('studentNo', userData.data?.universityId??"");
        form.setValue('project_name', project_name??"");
        form.setValue('dateSubmitted', new Date());
    },[project_name, userData]);
    
    const reportWork = useMutation({
        mutationFn: ReportNewWork,
        onError: (error) => {
            toast.error(error.toString());
        },
        onSuccess: () => {
            toast.success("Report Was saved.");
            form.reset();
            // location.reload();
            setOpen(false);
        },
    });

    const { mutate: server_reportWork } = reportWork;

    const onSubmit = (data: z.infer<typeof FormSchema>) => {
        if(user_Id){
            const reportWorkData: ReportWork_BaseType = {
                dateSubmitted: data.dateSubmitted,
                description: data.description,
                projectId: project_id,
                status: ReportWork_Status.PENDING,
                userId: user_Id,
                work_minutes: Number(data.workMins)
            }

            server_reportWork({ReprotWorkData: reportWorkData})
        } else {
            toast.error("Something went wrong. Please try angain later.")
        }

    }

    return (
        <>
            <Dialog  open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button 
                        variant={'default'}
                        disabled={false}
                    >
                        {'Report Work'}
                    </Button>
                </DialogTrigger>
                <DialogContent className="border-none flex flex-col items-center justify-between" >
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold tracking-widest mb-5" >{"Report Work"}</DialogTitle>
                        <DialogDescription>
                            
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
                            <FormFieldInput<FormSchemaType>
                                control={form.control}
                                name="studentNo"
                                label="Student No"
                                placeholder="Stduent Number"
                                disabled={true}
                                // isLoading={getReportDataById.isPending}
                            />
                            <FormFieldInput<FormSchemaType>
                                control={form.control}
                                name="project_name"
                                label="Project Name"
                                placeholder="Project Name"
                                disabled={true}
                                // isLoading={getReportDataById.isPending}
                            />
                            <FormFieldSimpleDatePicker<FormSchemaType>
                                control={form.control}
                                name="dateSubmitted"
                                label="Date Submitted"
                                // calStartDate={new Date("2000-01-01")}
                                // calEndDate={new Date()}
                                disabled={true}
                                // isLoading={getReportDataById.isPending}
                            />
                            <FormFieldInput<FormSchemaType>
                                control={form.control}
                                name="workMins"
                                label="Work Minutes"
                                placeholder="Work Minutes"
                                disabled={false}
                                type="number"
                                // isLoading={getReportDataById.isPending}
                            />
                            <FormFieldTextarea<FormSchemaType> 
                                name='description'
                                control={form.control}
                                label="Description"
                                placeholder="Description"
                                disabled={false}
                            />
                            <div className="mt-12" ></div>
                            <div className="w-full flex justify-center" >
                                <Button 
                                    variant={'default'}
                                    className={'px-20'}
                                    type="submit"
                                >
                                    {"Report"}
                                </Button>
                            </div>
                        </form>
                    </Form>
                    <DialogFooter>
                        
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}