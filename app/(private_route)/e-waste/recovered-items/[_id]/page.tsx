'use client'
import { FormFieldSelect } from "@/components/forms/form-field-select";
import { FormFieldTextarea } from "@/components/forms/form-field-textarea";
import { Form } from "@/components/ui/form";
import { ItemCharacteristicsMap, ItemType, RecoveredItems, RecoveredItems_BaseType, RecoveryLogs, Status } from "@/types/recovered-items";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { itemTypeFields } from "../add-type/types";
import FormFieldInput from "@/components/forms/form-field-input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { addRecoveredItem, getRecoveredItemById, updateRecoveredItemById } from "@/server/recoveredItems";
import { redirect, useParams, useRouter } from "next/navigation";
import { UserRole } from "@/types/User";
import { useSession } from "next-auth/react";
import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { AddItemLogDialog } from "@/components/custom-dialogs/add-item-dialog";

// Validation Schema (Dynamic Characteristics based on Item Type)
const FormSchema = z.object({
    description: z.string().min(10, { message: "A description is needed" }),
    itemType: z.nativeEnum(ItemType, { errorMap: () => ({ message: "Invalid item type." }) }),
    characteristics: z.record(z.string(), z.any()).optional(), 
    itemCount: z.number()
});

type FormSchemaType = z.infer<typeof FormSchema>;

const RecoveredItemsDetails = () => {
    const user = useSession();
    const user_role = user.data?.user.role || "";
    const { _id } = useParams();
    const router = useRouter();
    const [isEditingState, setIsEditingState] = useState<boolean>(false);
    const [selectedItemType, setSelectedItemType] = useState<ItemType | null>(null);
    const [recoveryLogs, setRecoveryLogs] = useState<RecoveryLogs[]>([]);
    const [openNewLog, setOpenNewLog] = useState<boolean>(false);

    const form = useForm<FormSchemaType>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
          description: "",
          itemCount:0,
          itemType: undefined,
          characteristics: {},
        },
    });

    // get all data related to _id
    const _getItemById = useMutation({
        mutationFn: getRecoveredItemById,
        onError(error, variables, context) {
            toast.error("Something went wrong. When getting item data");
        },
    });
    const { mutate: server_getItemById } = _getItemById;

    useEffect(() => {
        if(typeof(_id) == 'string'){
            server_getItemById({id: _id});
        }
    },[]);
    const itemData = _getItemById?.data;

    useEffect(()=> {
        if(itemData){
            form.setValue("itemType", itemData.type);
            form.setValue("description", itemData.description);
            form.setValue("itemCount", itemData.count);
            form.setValue("characteristics", itemData.characteristics);
        }
    },[itemData, _getItemById.isSuccess]);

    // Watch for changes in the selected item type
    const watchItemType = form.watch("itemType");

    useEffect(() => {
        setSelectedItemType(watchItemType || null);
    }, [watchItemType]);

    // create new project query 
    const { 
        mutate: server_updateRecoveredItemById,
        isPending,
        error
    } = useMutation({
        mutationFn: updateRecoveredItemById,
        onSuccess: () => {
            toast.success("Item updated successfully.");
            // location.reload();
        },
        onError(error, variables, context) {
            toast.error("Something went wrong.");
        },
    });

    // Form submission handler
    const onSubmit = (data: FormSchemaType) => {
        if(itemData){
            let recoveredItems_data: RecoveredItems = {
                _id: itemData._id,
                count: itemData.count, 
                recoveryLogs: itemData.recoveryLogs, 
                description: data.description??"",
                type: data.itemType,
                status: Status.PENDING,
                characteristics: data.characteristics as ItemCharacteristicsMap[ItemType],
                createdAt: itemData.createdAt,
                updatedAt: itemData.updatedAt
            }
            server_updateRecoveredItemById({item: recoveredItems_data});
        } else {
            toast.error("Please, try again. Something went wrong")
        }
        setIsEditingState(false);
    };

    useEffect(() => {
        if(itemData){
            setRecoveryLogs(itemData.recoveryLogs);
        }
    },[_getItemById.isSuccess, itemData]);

    const buttonDetails = {
        name: "New Log",
        onClick: () => {
            setOpenNewLog(true);
        },
    };

    return(
        <>
            <div className="flex flex-col space-y-10 items-center mt-5">
                <div className="w-full mb-8" >
                    <h1 className="text-2xl font-semibold text-primary">
                        Recovered Item Details
                    </h1>
                </div>
            </div>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="w-10/12 space-y-6">
                    <FormFieldSelect<FormSchemaType>
                        control={form.control}
                        name="itemType"
                        label="Type"
                        placeholder="Select the Type"
                        options={Object.values(ItemType).map(item => ({ value: item, label: item.valueOf() })) || []}
                        error={form.formState.errors.itemType?.message}
                        // isLoading={_getItemById.isPending}
                        disabled={!isEditingState}
                    />
                    <FormFieldInput<FormSchemaType>
                        control={form.control}
                        name="itemCount"
                        label="Item Count"
                        placeholder="Item Count"
                        type="number"
                        disabled={true}
                    />
                    <FormFieldTextarea<FormSchemaType> 
                        name='description'
                        control={form.control}
                        label="Description"
                        placeholder="Description"
                        error={form.formState.errors.description?.message}
                        disabled={!isEditingState}
                        // isLoading={_getItemById.isPending}
                    />

                    {/* Dynamic Fields Based on Item Type */}
                    {selectedItemType && (
                        <>
                            <h3 className="font-medium text-lg text-gray-700">{selectedItemType} Characteristics</h3>
                            {itemTypeFields[selectedItemType]?.map((field) => (
                                <FormFieldInput<FormSchemaType>
                                    key={field.name}
                                    control={form.control}
                                    name={`characteristics.${field.name}`}
                                    label={field.label}
                                    placeholder={`Enter ${field.label}`}
                                    type={field.type as "text" | "number"}
                                    disabled={!isEditingState}
                                />
                            ))}
                        </>
                    )}
                    <div className="mt-12" ></div>
                    { user_role == UserRole.Admin
                        ?<>
                            {!isEditingState &&
                                <Button 
                                    variant={'default'} 
                                    className=" text-white dark:text-black" 
                                    type={isEditingState?"submit":"button"}
                                    onClick={(e)=>{
                                        e.preventDefault();
                                        setIsEditingState(true);
                                    }}    
                                >
                                    Edit Item Type
                                </Button>
                            }
                            { isEditingState &&
                                <Button variant={'default'} className=" text-white dark:text-black" type="submit">
                                    { !isPending &&
                                        "save Item Type"
                                    }
                                    { isPending && 
                                        <>
                                            <p className="pl-3" >
                                                saving...
                                            </p>
                                        </>
                                    }    
                                </Button>
                            }
                            
                        </>
                        :<></>
                    }
                </form>
            </Form>

            <div className="h-16" ></div>
            <h3 className="font-medium text-lg text-gray-700">Recovery Logs</h3>
            {(user_role == UserRole.Admin) && _getItemById.data && // add new log -- dialog if and only-if get item data is available
                <AddItemLogDialog 
                    setOpen={setOpenNewLog}
                    open={openNewLog}
                    ItemId={itemData?._id}
                />
            }
            <DataTable
                columns={columns}
                data={recoveryLogs}
                isPending={_getItemById.isPending}
                buttonDetails={user_role===UserRole.Admin?buttonDetails:undefined} // add new log -- dialog
            />
            <div className="h-14" ></div>
        </>
    );
}

export default RecoveredItemsDetails;