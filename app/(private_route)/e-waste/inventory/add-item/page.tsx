"use client"
import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
} from "@/components/ui/form"
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createNewInventoryItem } from "@/server/inventory";
import { useSession } from "next-auth/react";
import { EWasteInventoryCondition, EWasteInventoryType } from "@/types/EWasteInventory";
import { getAllAdmins_name_id } from "@/server/user";
import FormFieldInput from "@/components/forms/form-field-input";
import { FormFieldTextarea } from "@/components/forms/form-field-textarea";
import { FormFieldSimpleDatePicker } from "@/components/forms/form-field-datepicker";
import { FormFieldSelect } from "@/components/forms/form-field-select";

const FormSchema = z.object({
    name: z.string().min(2, {
        message: "name must be at least 2 characters.",
    }),
    type: z.nativeEnum(EWasteInventoryType, {
        errorMap: () => ({ message: "Invalid inventory type." }),
    }),
    source: z.string().min(2, {
        message: "source must be at least 2 characters.",
    }),
    condition: z.nativeEnum(EWasteInventoryCondition, {
        errorMap: () => ({ message: "Invalid inventory condition" }),
    }),
    receivedDate: z.date(),
    description: z.string().min(2, {
        message: "type must be at least 2 characters.",
    }),
    acceptedPerson: z.string().regex(/^[a-f\d]{24}$/i, {
        message: "Select an admin",
    })
});
type FormSchemaType = z.infer<typeof FormSchema>;

const AddNewInventoryItem = () => {
    const { data } = useSession();
    const user_id = data?.user._id || "";

    const router = useRouter();
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
            source: "",
            receivedDate: new Date(),
            description: ""
        },
    });

    const { 
        mutate: server_createNewInventoryItem,
        isPending,
    } = useMutation({
        mutationFn: createNewInventoryItem,
        onSuccess: () => {
            toast.success("Inventory added successfully.");
            router.push('/e-waste/inventory');
        },
        onError(error, variables, context) {
            toast.error("Something went wrong.");
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

    function onSubmit(data: z.infer<typeof FormSchema>) {
        const newInventoryItem = {...data, failureReason: [], enteredBy: user_id}
        server_createNewInventoryItem({inventoryItem: newInventoryItem});
        form.reset();
    }

    return (
        <div className="flex flex-col space-y-10 items-center mt-5" >
            <div className="w-full" >
                <h1 className="font-semibold text-2xl text-primary" >
                    Add New Inverntory Item
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
                    <FormFieldSelect<FormSchemaType>
                        control={form.control}
                        name="type"
                        label="Type"
                        placeholder="Select a Type"
                        options={Object.values(EWasteInventoryType).map(item => ({ value: item, label: item.valueOf() })) || []}
                    />
                    <FormFieldInput<FormSchemaType>
                        control={form.control}
                        name="source"
                        label="Source"
                        placeholder="Source"
                    />
                    <FormFieldSelect<FormSchemaType>
                        control={form.control}
                        name="condition"
                        label="Condition"
                        placeholder="Select a Condition"
                        options={Object.values(EWasteInventoryCondition).map(item => ({ value: item, label: item.valueOf() })) || []}
                    />
                    <FormFieldSimpleDatePicker<FormSchemaType>
                        control={form.control}
                        name="receivedDate"
                        label="Received Date"
                    />
                    <FormFieldSelect<FormSchemaType>
                        control={form.control}
                        name="acceptedPerson"
                        label="Accepted Person"
                        placeholder="Select the e-waste batch accepted person"
                        options={getAdminData.data?.map(item => ({ value: item._id, label: item.name })) || []}
                        isLoadingOptions={getAdminData.isPending}
                    />
                    <FormFieldTextarea<FormSchemaType> 
                        name='description'
                        control={form.control}
                        label="Description"
                        placeholder="Description"
                    />
                    <div className="mt-12" ></div>
                    <Button variant={'default'} className=" text-white dark:text-black " type="submit">
                        { !isPending &&
                            "Add New Item"
                        }
                        { isPending && 
                            <>
                                <p className="pl-3" >
                                    Adding...
                                </p>
                            </>
                        }    
                    </Button>
                </form>
            </Form>
        </div>
    )
}

export default AddNewInventoryItem;