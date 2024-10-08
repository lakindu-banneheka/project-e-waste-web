import React, { InputHTMLAttributes } from 'react';
import { Control, FieldValues, FieldPath } from 'react-hook-form';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '../ui/form';
import { Input } from '../ui/input';
import { Skeleton } from '../ui/skeleton';

interface FormFieldInputProps<TFieldValues extends FieldValues> {
  control: Control<TFieldValues>;
  name: FieldPath<TFieldValues>;
  label: string;
  placeholder: string;
  disabled?: boolean;
  className?: string;
  isLoading?: boolean;
  type?: React.HTMLInputTypeAttribute | undefined
}

const FormFieldInput = <TFieldValues extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  disabled=false,
  isLoading=false,
  className,
  type
}: FormFieldInputProps<TFieldValues>) => {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <div className="flex flex-col space-y-3 md:space-y-0 w-10/12 md:flex-row items-start justify-start">
            <FormLabel className="mt-2 mr-5 w-28 min-w-28">{label}</FormLabel>
            { isLoading &&
                <Skeleton className="w-full h-10" />
            }
            { !isLoading &&
              <FormControl className="flex justify-center items-center">
                <Input
                  placeholder={placeholder}
                  {...field}
                  className="w-full min-w-[210px]"
                  disabled={disabled}
                  type={type}
                />
              </FormControl>
            }
          </div>
          <FormMessage className="ml-32" />
        </FormItem>
      )}
    />
  );
};

export default FormFieldInput;
