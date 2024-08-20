'use client'
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { deleteInventoryItemById, getInventoryItemById, updateInventoryItemById } from "@/server/inventory";
import { getAllAdmins_name_id, getUserNameById } from "@/server/user";
import { EWasteInventoryCondition, EWasteInventoryType } from "@/types/EWasteInventory";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { UserRole } from "@/types/User";
import FormFieldInput from "@/components/forms/form-field-input";
import { FormFieldTextarea } from "@/components/forms/form-field-textarea";
import { FormFieldSimpleDatePicker } from "@/components/forms/form-field-datepicker";
import { FormFieldSelect } from "@/components/forms/form-field-select";

const FormSchema = z.object({
    _id: z.string().regex(/^[a-f\d]{24}$/i, {
        message: "",
    }),
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
        message: "description must be at least 2 characters.",
    }),
    acceptedPerson: z.string().regex(/^[a-f\d]{24}$/i, {
        message: "Select an admin",
    }),
    enteredBy: z.string(),
    createdAt: z.date(),
    updatedAt: z.date(),

});
type FormSchemaType = z.infer<typeof FormSchema>;


const EWasteUnitDetails = () => {
    const { data } = useSession();
    const user_id = data?.user._id || "";
    const user_role = data?.user.role;
    const { _id } = useParams();
    const [isEditingState, setIsEditingState] = useState<boolean>(false);
    const router = useRouter();

    // get all data related to _id
    const getInventoryItemDataById = useMutation({
        mutationFn: getInventoryItemById,
        onError(error, variables, context) {
            toast.error("Something went wrong.");
        },
    });
    const { mutate: server_getInventoryItemById } = getInventoryItemDataById;

    useEffect(() => {
        if(typeof(_id) == 'string'){
            server_getInventoryItemById({id: _id});
        }
    },[]);
    const inventoryItemData = getInventoryItemDataById?.data; 

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

    
    const get_UserNameById = useMutation({
        mutationFn: getUserNameById,
        onError(error, variables, context) {
            toast.error("User Name can't be loaded");
        },
    });

    const { mutate: server_getUserNameById } = get_UserNameById;

    useEffect(() => {
        if(inventoryItemData?.acceptedPerson){
            server_getUserNameById({_id: inventoryItemData.acceptedPerson});
        }
    },[getInventoryItemDataById.isSuccess]);

    useEffect(()=> {
        if(get_UserNameById.data){
            form.setValue("enteredBy", (get_UserNameById.data));
        }
    },[get_UserNameById.isSuccess]);

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            name: "",
            source: "",
            receivedDate: new Date(),
            description: "",
        },
    });

    useEffect(() => {
        if (inventoryItemData) {
          form.reset({
            _id: inventoryItemData._id,
            name: inventoryItemData.name,
            source: inventoryItemData.source,
            receivedDate: inventoryItemData.receivedDate,
            description: inventoryItemData.description,
            acceptedPerson: inventoryItemData.acceptedPerson,
            condition: inventoryItemData.condition,
            type: inventoryItemData.type,
            // enteredBy: get_UserNameById.data,
            createdAt: inventoryItemData.createdAt,
            updatedAt: inventoryItemData.updatedAt
          });
        }
      }, [inventoryItemData]);


    const update_InventoryItemById = useMutation({
        mutationFn: updateInventoryItemById,
        onError(error, variables, context) {
            toast.error("Something went wrong.");
        },
        onSuccess() {
            if(typeof(_id) == 'string'){
                server_getInventoryItemById({id: _id});
            }
        }
    });
    const { mutate: server_updateInventoryItemById } = update_InventoryItemById;

    function onSubmit(data: z.infer<typeof FormSchema>) {
        const inventoryItem = {...data, failureReason: [], enteredBy: user_id}
        server_updateInventoryItemById({item: inventoryItem})
        form.reset();
    }


    const delete_InventoryItemById = useMutation({
        mutationFn: deleteInventoryItemById,
        onError(error, variables, context) {
            toast.error(error.toString());
        },
        onSuccess() {
            if(typeof(_id) == 'string'){
                server_getInventoryItemById({id: _id});
            }
        }
    });
    const { mutate: server_deleteInventoryItemById } = delete_InventoryItemById;
    

    function onDelete() {
        if(typeof(_id) == 'string'){
            server_deleteInventoryItemById({id: _id});
        } else {
            toast.error("Multiple items can't be deleted at onece");
        }
    }
    
    
    return (
        <>
            <div className="flex flex-col space-y-10 items-center mt-5" >
                <div className="w-full" >
                    <h1 className="font-semibold text-2xl text-primary" >
                        Inverntory Item Details
                    </h1>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="w-10/12 space-y-6">
                        <FormFieldInput<FormSchemaType>
                            control={form.control}
                            name="_id"
                            label="ID"
                            placeholder="ID"
                            disabled={!isEditingState}
                            isLoading={getInventoryItemDataById.isPending}
                        />
                        <FormFieldInput<FormSchemaType>
                            control={form.control}
                            name="name"
                            label="Name"
                            placeholder="Name"
                            disabled={!isEditingState}
                            isLoading={getInventoryItemDataById.isPending}
                        />
                        <FormFieldSelect<FormSchemaType>
                            control={form.control}
                            name="type"
                            label="Type"
                            placeholder="Select a Type"
                            options={Object.values(EWasteInventoryType).map(item => ({ value: item, label: item.valueOf() })) || []}
                            disabled={!isEditingState}
                            isLoading={getInventoryItemDataById.isPending}
                        />
                        <FormFieldInput<FormSchemaType>
                            control={form.control}
                            name="source"
                            label="Source"
                            placeholder="Source"
                            disabled={!isEditingState}
                            isLoading={getInventoryItemDataById.isPending}
                        />
                        <FormFieldSelect<FormSchemaType>
                            control={form.control}
                            name="condition"
                            label="Condition"
                            placeholder="Select a Condition"
                            options={Object.values(EWasteInventoryCondition).map(item => ({ value: item, label: item.valueOf() })) || []}
                            disabled={!isEditingState}
                            isLoading={getInventoryItemDataById.isPending}
                        />
                        <FormFieldInput<FormSchemaType>
                            control={form.control}
                            name="enteredBy"
                            label="Entered By"
                            placeholder="Entered By"
                            disabled={!isEditingState}
                            isLoading={getInventoryItemDataById.isPending || get_UserNameById.isPending}
                        />
                        <FormFieldSimpleDatePicker<FormSchemaType>
                            control={form.control}
                            name="receivedDate"
                            label="Received Date"
                            disabled={!isEditingState}
                            isLoading={getInventoryItemDataById.isPending}
                        />
                        <FormFieldSelect<FormSchemaType>
                            control={form.control}
                            name="acceptedPerson"
                            label="Accepted Person"
                            placeholder="Select the e-waste batch accepted person"
                            options={getAdminData.data?.map(item => ({ value: item._id, label: item.name })) || []}
                            disabled={!isEditingState}
                            isLoading={getInventoryItemDataById.isPending || getAdminData.isPending}
                            isLoadingOptions={getAdminData.isPending}
                        />
                        <FormFieldSimpleDatePicker<FormSchemaType>
                            control={form.control}
                            name="createdAt"
                            label="Added Date"
                            disabled={!isEditingState}
                            isLoading={getInventoryItemDataById.isPending}
                        />
                        <FormFieldSimpleDatePicker<FormSchemaType>
                            control={form.control}
                            name="updatedAt"
                            label="Updated Date"
                            disabled={!isEditingState}
                            isLoading={getInventoryItemDataById.isPending}
                        />
                        <FormFieldTextarea<FormSchemaType> 
                            name='description'
                            control={form.control}
                            label="Description"
                            placeholder="Description"
                            disabled={!isEditingState}
                            isLoading={getInventoryItemDataById.isPending}
                        />
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
                                        Update Inventory Item
                                    </Button>
                                }
                                { isEditingState &&
                                    <Button variant={'default'} className=" text-white dark:text-black" type={isEditingState?"submit":"button"}   
                                    >
                                        { !update_InventoryItemById.isPending &&
                                            "Save Updated data"
                                        }
                                        { update_InventoryItemById.isPending && 
                                            "Updating..."
                                        }    
                                    </Button>

                                }
                            </>  
                            <Button 
                                variant={'destructive'} 
                                className=" " 
                                type={"button"}   
                                onClick={(e)=>{
                                    e.preventDefault();
                                    if(user_role == UserRole.Admin){
                                        onDelete();
                                    } else {
                                        toast.error("You have to be an admin to delete items.")
                                    }
                                }}    
                            >
                                { !delete_InventoryItemById.isPending &&
                                    "Delete"
                                }
                                { delete_InventoryItemById.isPending && 
                                    "Deleting..."
                                }    
                            </Button>
                        </div>
                    </form>
                </Form>
                <div className="mt-14" ></div>
            </div>
        </>
    );
};

export default EWasteUnitDetails;