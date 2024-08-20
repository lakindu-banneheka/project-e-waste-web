import React from "react";
import { Control, FieldValues, FieldPath } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Textarea } from "../ui/textarea";
import { Skeleton } from "../ui/skeleton";

interface FormFieldTextareaProps<TFieldValues extends FieldValues> {
    control: Control<TFieldValues>;
    name: FieldPath<TFieldValues>;
    label: string;
    placeholder: string;
    disabled?: boolean;
    className?: string; 
    isLoading?: boolean;
}


export const FormFieldTextarea = <TFieldValues extends FieldValues>({
    control,
    name,
    label,
    placeholder,
    disabled=false,
    isLoading=false,
    className,
}: FormFieldTextareaProps<TFieldValues>) => {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className={className} >
                    <div className="flex flex-row items-start justify-start" >
                        <FormLabel className="mt-3 mr-5 w-28 min-w-28">{label}</FormLabel>
                        { isLoading &&
                            <Skeleton className="w-full h-10" />
                        }
                        { !isLoading &&
                            <FormControl className="flex justify-center items-center" >
                                <Textarea placeholder={placeholder} {...field} className="w-full min-w-[210px]" disabled={disabled} />
                            </FormControl>
                        }
                    </div>
                    <FormMessage className="ml-32" />
                </FormItem>
            )}
        />
    );
}