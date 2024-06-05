'use client'
import { AuthBackground } from "@/components/auth/auth-background";
import logo from '@/assets/logo/ewaste_logo 1.png';
import Image from "next/image";
import React, { useState } from "react";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { passwordSchema, universityEmailSchema } from "@/utils/user-validation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { InputOTPForm } from "@/components/InputOTPForm";
import { BreadcrumbWithCustomSeparator } from "@/components/forgot-password/BreadcrumbWithCustomSeparator";

const FormEmailSchema = z.object({
    email: universityEmailSchema
})

const FormPasswordSchema = z.object({
    password: passwordSchema,
    confirmPassword: z.string(),
})
.refine(
    values => values.password === values.confirmPassword,
    {
        message: "Passwords do not match.",
        path: ["confirmPassword"],
    }
);

const ForgotPassword = () => {
    const [breadcrumbValues, setBreadcrumbValues] = useState<string[]>([]);

    const email_form = useForm<z.infer<typeof FormEmailSchema>>({
        resolver: zodResolver(FormEmailSchema),
    });

    const password_form = useForm<z.infer<typeof FormPasswordSchema>>({
        resolver: zodResolver(FormPasswordSchema),
    });

    function onSubmitEmail(data: z.infer<typeof FormEmailSchema>) {
        console.log(data.email);
        // send email 

        // if ok
        toast.message(`You will recive OTP code to ${data.email}`)
    }

    function onSubmitPasswordChange(data: z.infer<typeof FormPasswordSchema>) {
        console.log(data.password);
        // send to update password 

        // if ok
        toast.message(`Password Changed successfuly.`)
    }

    return (
        <>
            <div className="w-full lg:grid lg:grid-cols-2 h-screen overflow-auto">
                <AuthBackground />
                <div className="flex items-start justify-center py-12">
                    <div className="mx-auto grid w-[350px] gap-6">
                        <div className="grid gap-2 w-full" >
                            <div className="flex justify-center w-full items-center" >
                                <Image
                                    src={logo}
                                    alt="Image"
                                    width="200"
                                    height="80" 
                                    className="w-auto h-auto"
                                />
                            </div>
                        </div>
                        <div className="grid gap-2 text-center">
                            <h1 className="text-3xl font-bold">
                                Reset Password
                            </h1>
                        </div>
                        <div>
                            <BreadcrumbWithCustomSeparator 
                                breadcrumValues={breadcrumbValues}
                                max={3}
                            />
                        </div>
                        <div>
                            <Form {...email_form}>
                                <form onSubmit={email_form.handleSubmit(onSubmitEmail)} className="w-full space-y-3">
                                    <FormField
                                    control={email_form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="example@stu.kln.ac.lk" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            Please Enter your Email address to receive a verification OTP 
                                        </FormDescription>
                                        <FormMessage />
                                        </FormItem>
                                    )}
                                    />
                                    <Button type="submit">Send OTP</Button>
                                </form>
                            </Form>
                        </div>
                        <div>
                            <InputOTPForm
                                // key={1}
                                // lable='OTP '
                                // formDescription='Please enter the one-time password sent to your email.'
                                // buttonLable='Verify'
                            />
                        </div>
                        <div>
                            <Form {...password_form}>
                                <form onSubmit={password_form.handleSubmit(onSubmitPasswordChange)} className="w-full space-y-3">
                                    <FormField
                                        control={password_form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                            <FormLabel>New Password</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={password_form.control}
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                            <FormLabel>Confirm New Password</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Button type="submit">Change Password</Button>
                                </form>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ForgotPassword;