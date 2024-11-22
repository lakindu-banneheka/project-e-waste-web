'use client'
import { FormFieldSelect } from "@/components/forms/form-field-select";
import { FormFieldTextarea } from "@/components/forms/form-field-textarea";
import { Form } from "@/components/ui/form";
import { ItemCharacteristicsMap, ItemType, RecoveredItems_BaseType, Status } from "@/types/recovered-items";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { itemTypeFields } from "./types";
import FormFieldInput from "@/components/forms/form-field-input";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { addRecoveredItem } from "@/server/recoveredItems";
import { redirect, useRouter } from "next/navigation";
import { UserRole } from "@/types/User";
import { useSession } from "next-auth/react";

// Validation Schema (Dynamic Characteristics based on Item Type)
const FormSchema = z.object({
    description: z.string().min(10, { message: "A description is needed" }),
    itemType: z.nativeEnum(ItemType, { errorMap: () => ({ message: "Invalid item type." }) }),
    characteristics: z.record(z.string(), z.any()).optional(), 
});

type FormSchemaType = z.infer<typeof FormSchema>;

const NewRecoveredType = () => {
    const user = useSession();
    const user_role = user.data?.user.role || "";
    if(user_role != UserRole.Admin) redirect("/e-waste/recovered-items");

    const router = useRouter();
    const [selectedItemType, setSelectedItemType] = useState<ItemType | null>(null);

    const form = useForm<FormSchemaType>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
          description: "",
          itemType: undefined,
          characteristics: {},
        },
    });

    // Watch for changes in the selected item type
    const watchItemType = form.watch("itemType");

    useEffect(() => {
        setSelectedItemType(watchItemType || null);
    }, [watchItemType]);

    // create new project query 
    const { 
        mutate: server_createNewProject,
        isPending,
        error
    } = useMutation({
        mutationFn: addRecoveredItem,
        onSuccess: () => {
            toast.success("Project created successfully.");
            router.push('/e-waste/recovered-items');
        },
        onError(error, variables, context) {
            toast.error("Something went wrong.");
        },
    });

    // Form submission handler
    const onSubmit = (data: FormSchemaType) => {
        let recoveredItems_data: RecoveredItems_BaseType = {
            count:0, 
            recoveryLogs: [], 
            description: data.description??"",
            type: data.itemType,
            status: Status.PENDING,
            characteristics: data.characteristics as ItemCharacteristicsMap[ItemType]
        }
        server_createNewProject({recoveredItemData: recoveredItems_data});

        toast.success("Item Type added successfully!");
        form.reset();
    };


    return(
        <>
            <div className="flex flex-col space-y-10 items-center mt-5">
                <div className="w-full mb-8" >
                    <h1 className="text-2xl font-semibold text-primary">
                        Add New Item Type
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
                    />
                    <FormFieldTextarea<FormSchemaType> 
                        name='description'
                        control={form.control}
                        label="Description"
                        placeholder="Description"
                        error={form.formState.errors.description?.message}
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
                                />
                            ))}
                        </>
                    )}
                    <div className="mt-12" ></div>
                    <Button variant={'default'} className=" text-white dark:text-black" type="submit">
                        { !isPending &&
                            "Add Item Type"
                        }
                        { isPending && 
                            <>
                                <p className="pl-3" >
                                    adding...
                                </p>
                            </>
                        }    
                    </Button>
                </form>
            </Form>
        </>
    );
}

export default NewRecoveredType;