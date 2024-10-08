import React from "react";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Skeleton } from "../ui/skeleton";

interface FormFieldSimpleDatePickerProps<TFieldValues extends FieldValues> {
    control: Control<TFieldValues>;
    name: FieldPath<TFieldValues>;
    label: string;
    placeholder?: string;
    disabled?: boolean;
    className?: string;
    isLoading?: boolean;
    calStartDate?: Date;
    calEndDate?: Date;
}

export const FormFieldSimpleDatePicker = <TFiTFieldValues extends FieldValues>({
    control,
    name,
    label,
    placeholder,
    disabled=false,
    isLoading=false,
    calEndDate=new Date(),
    calStartDate=new Date("1900-01-01"),
    className,
}: FormFieldSimpleDatePickerProps<TFiTFieldValues>) => {
    return(
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className={className} >
                    <div className="flex flex-col space-y-3 md:space-y-0 w-10/12 md:flex-row items-start justify-start" >
                        <FormLabel className="mt-2 mr-5 w-28 min-w-28">{label}</FormLabel>
                        { isLoading &&
                            <Skeleton  className="w-full h-10" />
                        }
                        { !isLoading &&
                            <Popover>
                                <PopoverTrigger asChild  disabled={disabled}>
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
                                                <span>{placeholder??"Pick a date"}</span>
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
                                            date > calEndDate || date < calStartDate
                                        }
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        }
                    </div>
                    <FormMessage className="ml-32" />
                </FormItem>
            )}
        />
    );
}