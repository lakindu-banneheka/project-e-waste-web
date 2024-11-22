'use client'
import { FormFieldSimpleDatePicker } from "@/components/forms/form-field-datepicker";
import FormFieldInput from "@/components/forms/form-field-input";
import { FormFieldSelect } from "@/components/forms/form-field-select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { getAllInventoryItems } from "@/server/inventory";
import { addRecoveryLog, updateRecoveredItemById } from "@/server/recoveredItems";
import { InventoryAction, RecoveredItems, RecoveryLogs, Status } from "@/types/recovered-items";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const FormSchemaRecoveryLog = z.object({
    inventoryAction: z.nativeEnum(InventoryAction, {
        errorMap: () => ({ message: "Invalid inventory action." }),
    }),
    ewaste_unit_id: z.string().optional(),
    recovered_date: z.date(),
    no_of_items: z.string(),
    recoveredBy: z.string(),
    status: z.nativeEnum(Status, {
        errorMap: () => ({ message: "Invalid inventory status." }),
    }),
    approvedBy: z.string().optional(),
    id: z.string().optional(),
});
type FormSchemaRecoveryLogType = z.infer<typeof FormSchemaRecoveryLog>;


export const AddItemLogDialog = (
    {
        open=false,
        setOpen,
        isFromMoreDetails=false, 
        ItemDataFromMoreDetails,
        ItemId
    }:{
        open: boolean,
        setOpen: React.Dispatch<React.SetStateAction<boolean>>
        isFromMoreDetails?: boolean, 
        ItemDataFromMoreDetails?: RecoveryLogs,
        ItemId?: string
    }) => {
    const user = useSession();
    const user_Id = user.data?.user._id;
    const user_role = user.data?.user.role;
    const [isSelectedInventoryAction_ReleaseItem, setIsSelectedInventoryAction_ReleaseItem] = useState<boolean>(false);

    // setup form 
    const form = useForm<z.infer<typeof FormSchemaRecoveryLog>>({
        resolver: zodResolver(FormSchemaRecoveryLog),
        defaultValues: {
            recoveredBy: user_Id,
            recovered_date: new Date(),
            status: Status.PENDING
        },
    });

    useEffect(()=> {
        if(ItemDataFromMoreDetails){
            form.setValue("ewaste_unit_id", ItemDataFromMoreDetails.ewaste_unit_id);
            form.setValue("inventoryAction", ItemDataFromMoreDetails.inventoryAction);
            form.setValue("no_of_items", ItemDataFromMoreDetails.no_of_items.toString());
            form.setValue("recoveredBy", ItemDataFromMoreDetails.recoveredBy);
            form.setValue("recovered_date", ItemDataFromMoreDetails.recovered_date);
            form.setValue("status", ItemDataFromMoreDetails.status);
            form.setValue("approvedBy", ItemDataFromMoreDetails.approvedBy);
            form.setValue("id", ItemDataFromMoreDetails.id);            
        }
    },[ItemDataFromMoreDetails, isFromMoreDetails]);

    // getAll inventory data
    const _getAllUnitInventory = useMutation({
        mutationFn: getAllInventoryItems, // create a basic user type then try again
    });
    const  { mutate: server_getAllUnitInventory } = _getAllUnitInventory;

    useEffect(() => {
        server_getAllUnitInventory();
    }, []);

    // Watch for changes 
    const watchInvenotyAction = form.watch("inventoryAction");

    useEffect(() => {
        if(watchInvenotyAction === InventoryAction.ReleaseItem){
            setIsSelectedInventoryAction_ReleaseItem(true);
        } else {
            setIsSelectedInventoryAction_ReleaseItem(false);
        }
    }, [watchInvenotyAction]);

    const _addNewRecoveryLog = useMutation({
        mutationFn: addRecoveryLog,
        onError: (error) => {
            toast.error(error.toString());
        },
        onSuccess: () => {
            toast.success("Item Was saved.");
            location.reload();
        },
    });

    const { mutate: server_addNewRecoveryLog } = _addNewRecoveryLog;

    const onSubmit_update = (data: z.infer<typeof FormSchemaRecoveryLog>) => {
        if (user_Id && ItemId) {

            const newRecoveryLogData: RecoveryLogs = {
                ewaste_unit_id: isSelectedInventoryAction_ReleaseItem?(data.ewaste_unit_id??""):"",
                inventoryAction: data.inventoryAction,
                no_of_items: Number(data.no_of_items),
                recovered_date: data.recovered_date,
                recoveredBy: data.recoveredBy,
                status: data.status,
            };

            server_addNewRecoveryLog({
                recoveredItemId: ItemId,
                log: newRecoveryLogData
            })
        } else {
            toast.error("Something went wrong. Please try angain later.")
        }
        setOpen(false);
        
    }

    return (
        <>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="border-none flex flex-col items-center justify-between" >
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-bold tracking-widest mb-5" >{"New Recovered Item(s)"}</DialogTitle>
                        <DialogDescription>
                            
                        </DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit_update)} className="w-full space-y-6">
                            <FormFieldInput<FormSchemaRecoveryLogType>
                                control={form.control}
                                name="no_of_items"
                                label="Item Count"
                                placeholder="Item Count"
                                type="number"
                                disabled={isFromMoreDetails}
                            />
                            <FormFieldSelect<FormSchemaRecoveryLogType>
                                control={form.control}
                                name="inventoryAction"
                                label="Inventory Action"
                                placeholder="Select a Action"
                                options={Object.values(InventoryAction).map(item => ({ value: item, label: item.valueOf() })) || []}
                                disabled={isFromMoreDetails}
                            />
                            <FormFieldSelect<FormSchemaRecoveryLogType>
                                control={form.control}
                                name="ewaste_unit_id"
                                label="Unit"
                                placeholder="Select a Unit"
                                options={_getAllUnitInventory.data?.map(item => ({ value: item._id, label: item.name })) || []}
                                disabled={isSelectedInventoryAction_ReleaseItem}
                            />
                            <FormFieldSimpleDatePicker<FormSchemaRecoveryLogType>
                                control={form.control}
                                name="recovered_date"
                                label="Recovered Date"
                                // calStartDate={new Date("2000-01-01")}
                                // calEndDate={new Date()}
                                disabled={true}
                                // isLoading={getReportDataById.isPending}
                            />
                            
                            
                            <div className="mt-12" ></div>
                            {/* { user_role === UserRole.Admin && isFromMoreDetails && // for admin to approve or decline the log -- after aproving it will added to the total count of the item type
                                <>
                                
                                </>
                            } */}
                            { !isFromMoreDetails &&
                                <div className="w-full flex justify-center" >
                                    <Button 
                                        variant={'default'}
                                        className={'px-20'}
                                        type="submit"
                                    >
                                        {"ADD"}
                                    </Button>
                                </div>
                            }
                        </form>
                    </Form>
                    <DialogFooter>
                        
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}