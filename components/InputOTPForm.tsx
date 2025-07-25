"use client"
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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { toast } from "@/components/ui/use-toast"
import { useEffect, useState } from "react"

const FormSchema = z.object({
  pin: z.string().min(6, {
    message: "Your one-time password must be 6 characters.",
  }),
})

interface InputOTPFormProps {
  label?: string;
  formDescription?: string;
  buttonLabel?: string;
  otpVerification: ({pin}: {pin: string})=>void;
  handleResendOTP: () => void;
  isPending: boolean;
}

export function InputOTPForm({ label, buttonLabel, formDescription, otpVerification, handleResendOTP, isPending }: InputOTPFormProps) {
  const [isResendDisabled, setIsResendDisabled] = useState<boolean>(false);
  
  useEffect(()=> {
    setTimeout(() => {
      setIsResendDisabled(false);
    }, 1000 * 60 * 2);
  },[isResendDisabled]);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pin: "",
    },
  })

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
    otpVerification({pin: data.pin})
  }

  function onClickResendOTP() {
    setIsResendDisabled(true);
    handleResendOTP();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <FormField
          control={form.control}
          name="pin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{ label || `One-Time Password`}</FormLabel>
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>
                {formDescription}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex space-x-3" >
          <Button 
            type="button" 
            variant='secondary'  
            onClick={onClickResendOTP}
            disabled={isResendDisabled}
          >
            {`Resend OTP`}
          </Button>
          <Button 
            type="submit"
            disabled={isPending}
          >
            { buttonLabel || `Submit`}
          </Button>
        </div>
      </form>
    </Form>
  )
}
