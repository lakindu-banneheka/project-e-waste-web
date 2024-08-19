"use client"
import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { createNewInventoryItem } from "@/server/inventory";
import { useSession } from "next-auth/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EWasteInventoryCondition, EWasteInventoryType } from "@/types/EWasteInventory";
import { getAllAdmins_name_id } from "@/server/user";
import { ring } from 'ldrs';
// import { isDarkMode } from "@/lib/theme";


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
})

const addNewInventoryItem = () => {
    const { data } = useSession();
    const user_id = data?.user._id || "";
    ring.register();

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
    },[])

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
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem className="flex flex-col" >
                            <div className="flex flex-row items-start justify-start" >
                                <FormLabel className="mt-2 mr-5 w-28 min-w-28">Name</FormLabel>
                                <FormControl className="flex justify-center items-center" >
                                    <Input placeholder="Name" {...field} className="w-full min-w-[210px]" />
                                </FormControl>
                            </div>
                            <FormMessage className="ml-32" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem className="flex flex-col" >
                            <div className="flex flex-row items-start justify-start" >
                                <FormLabel className="mt-2 mr-5 w-28 min-w-28">Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value} >
                                    <FormControl  >
                                        <SelectTrigger className="w-full min-w-[210px]" >
                                            <SelectValue placeholder="Select a Type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value={EWasteInventoryType.AUTOMOBILE}>{EWasteInventoryType.AUTOMOBILE.valueOf()}</SelectItem>
                                        <SelectItem value={EWasteInventoryType.DOMESTIC}>{EWasteInventoryType.DOMESTIC.valueOf()}</SelectItem>
                                        <SelectItem value={EWasteInventoryType.INDUSTRIAL}>{EWasteInventoryType.INDUSTRIAL.valueOf()}</SelectItem>
                                        <SelectItem value={EWasteInventoryType.MEDICAL}>{EWasteInventoryType.MEDICAL.valueOf()}</SelectItem>
                                        <SelectItem value={EWasteInventoryType.OFFICE}>{EWasteInventoryType.OFFICE.valueOf()}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <FormMessage className="ml-32" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="source"
                    render={({ field }) => (
                        <FormItem className="flex flex-col" >
                            <div className="flex flex-row items-start justify-start" >
                                <FormLabel className="mt-2 mr-5 w-28 min-w-28">Source</FormLabel>
                                <FormControl className="flex justify-center items-center" >
                                    <Input placeholder="Source" {...field} className="w-full min-w-[210px]" />
                                </FormControl>
                            </div>
                            <FormMessage className="ml-32" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="condition"
                    render={({ field }) => (
                        <FormItem className="flex flex-col" >
                            <div className="flex flex-row items-start justify-start" >
                                <FormLabel className="mt-2 mr-5 w-28 min-w-28">Condition</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value} >
                                    <FormControl  >
                                        <SelectTrigger className="w-full min-w-[210px]" >
                                            <SelectValue placeholder="Select a Condition" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value={EWasteInventoryCondition.NON_REPARABLE}>{EWasteInventoryCondition.NON_REPARABLE.valueOf()}</SelectItem>
                                        <SelectItem value={EWasteInventoryCondition.REPARABLE}>{EWasteInventoryCondition.REPARABLE.valueOf()}</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <FormMessage className="ml-32" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="receivedDate"
                    render={({ field }) => (
                        <FormItem className="flex flex-col" >
                            <div className="flex flex-row items-start justify-start" >
                                <FormLabel className="mt-2 mr-5 w-28 min-w-28">Received Date</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full min-w-[210px] pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                            date > new Date() || date < new Date("1900-01-01")
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                            <FormMessage className="ml-32" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="acceptedPerson"
                    render={({ field }) => (
                        <FormItem className="flex flex-col" >
                            <div className="flex flex-row items-start justify-start" >
                                <FormLabel className="mt-2 mr-5 w-28 min-w-28">Accepted Person</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value} >
                                    <FormControl  >
                                        <SelectTrigger className="w-full min-w-[210px]" >
                                            <SelectValue placeholder="Select the e-waste batch accepted person" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        { 
                                            getAdminData.data?.map((admin,i)=>(
                                                <SelectItem key={i} value={admin._id}>{admin.name}</SelectItem>
                                            ))
                                        }
                                    </SelectContent>
                                </Select>
                            </div>
                            <FormMessage className="ml-32" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem className="flex flex-col" >
                            <div className="flex flex-row items-start justify-start" >
                                <FormLabel className="mt-3 mr-5 w-28 min-w-28">Description</FormLabel>
                                <FormControl className="flex justify-center items-center" >
                                    <Textarea placeholder="Description" {...field} className="w-full min-w-[210px]" />
                                </FormControl>
                            </div>
                            <FormMessage className="ml-32" />
                        </FormItem>
                    )}
                />
                <div className="mt-12" ></div>
                <Button variant={'default'} className=" text-white dark:text-black " type="submit">
                { !isPending &&
                    "Add New Item"
                }
                { isPending && 
                    <>
                        <l-ring
                            size="16"
                            stroke="2"
                            bg-opacity="0"
                            speed="2" 
                            color={'white'}
                        ></l-ring>
                        <p className="pl-3 text-white" >
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

export default addNewInventoryItem;