import React from "react";
import { Control, FieldPath, FieldValues, Controller } from "react-hook-form";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Skeleton } from "../ui/skeleton";

interface FormFieldSelectProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  placeholder: string;
  options: Array<{ value: string; label: string }>;
  disabled?: boolean;
  className?: string;
  isLoading?: boolean;
  isLoadingOptions?: boolean;
  error?: string;
}

export const FormFieldSelect = <TFieldValues extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  options,
  disabled = false,
  isLoading = false,
  isLoadingOptions = false,
  className,
  error
}: FormFieldSelectProps<TFieldValues>) => {
  return (
    <FormItem className={className}>
      <div className="flex flex-col space-y-3 md:space-y-0 w-10/12 md:flex-row items-start justify-start">
        <FormLabel className={`mt-2 mr-5 w-28 min-w-28 ${error?'text-destructive':''}`}>{label}</FormLabel>
        {isLoading && <Skeleton className="w-full h-10" />}
        {!isLoading && (
          <Controller
            control={control}
            name={name}
            render={({ field }) => (
              <Select
                disabled={disabled}
                {...field}
                onValueChange={field.onChange}
              >
                <FormControl>
                  <SelectTrigger className="w-full min-w-[210px]">
                    <SelectValue placeholder={placeholder} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {isLoadingOptions &&
                    Array(2)
                      .fill(null)
                      .map((_, index) => <Skeleton key={index} className="w-full h-8 mb-2" />)}
                  {!isLoadingOptions &&
                    options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )}
          />
        )}
      </div>
      <FormMessage className="ml-32" >
        {error && <span className="text-destructive text-sm">{error}</span>}
      </FormMessage>
    </FormItem>
  );
};
