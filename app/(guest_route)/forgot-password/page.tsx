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
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { InputOTPForm } from "@/components/InputOTPForm";
import { BreadcrumbWithCustomSeparator } from "@/components/forgot-password/BreadcrumbWithCustomSeparator";
import { Eye, EyeOff } from "lucide-react";
import { Tabs } from "@/types/forgot-password-tabs";

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
    const [tabsValues, setTabsValues] = useState<Tabs[]>([Tabs.EMAIL]);
    const [isTabActionDisabeled, setIsTabActionDisabeled] = useState<boolean>(false);

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
        toast.message(`One-time password has been sent to your email,`,{
            description: data.email
        })
        // setTabsValues(prev=>[...prev,Tabs.OTP])
        const newTabVals = [...tabsValues, Tabs.OTP];
        setTabsValues(newTabVals);


        // else
        // toast.error(`Something went wrong.`)

    }

    function onSubmitPasswordChange(data: z.infer<typeof FormPasswordSchema>) {
        console.log(data.password);

        // send to update password 

        // if ok
        toast.success(`Password Changed successfuly.`);

        // else
        // toast.error(`failed.`); // add the error to description

    }

    function otpVerification({pin}: {pin: string}) {
        console.log('pin', pin);

        // verification code here
        
        // ok
        toast.success(`OTP Verified`);
        const newTabVals = [...tabsValues, Tabs.CHANGE_PASSWORD];
        setTabsValues(newTabVals);

        setIsTabActionDisabeled(true);

        // else
        // toast.error(`OTP Verifiecation failed`);  // add the error to description
    }

    return (
        <>
            <div className="w-full lg:grid lg:grid-cols-2 h-screen overflow-hidden">
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
                        <div className="grid gap-2 text-left" >
                            <BreadcrumbWithCustomSeparator 
                                breadcrumValues={tabsValues}
                                max={3}
                                setBreadcrumbValues={setTabsValues}
                                isDisabled={isTabActionDisabeled}
                            />
                        </div>
                        <RenderTab
                            activeTab={tabsValues[tabsValues.length-1]}
                            email_form={email_form}
                            password_form={password_form}
                            onSubmitEmail={onSubmitEmail}
                            onSubmitPasswordChange={onSubmitPasswordChange}
                            otpVerification={otpVerification}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default ForgotPassword;

interface RenderTabProps {
    activeTab: Tabs;
    email_form: UseFormReturn<{email: string;}, any, undefined>;
    onSubmitEmail: (data: z.infer<typeof FormEmailSchema>) => void;
    password_form: UseFormReturn<{password: string;confirmPassword: string;}, any, undefined>
    onSubmitPasswordChange: (data: z.infer<typeof FormPasswordSchema>) => void;
    otpVerification: ({pin}: {pin: string}) => void
}

function RenderTab({activeTab, email_form, password_form, onSubmitPasswordChange, onSubmitEmail, otpVerification}: RenderTabProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
    };
    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    switch (activeTab) {
        case Tabs.EMAIL:
            return (
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
                                <FormMessage className="text-red-500" />
                                </FormItem>
                            )}
                            />
                            <Button type="submit">Send OTP</Button>
                        </form>
                    </Form>
                </div>
            )
        case Tabs.OTP:
            return (
                <InputOTPForm
                    // key={1}
                    label='One-Time Password'
                    formDescription='Please enter the one-time password sent to your email.'
                    buttonLabel='Verify'
                    otpVerification={otpVerification}
                />
            );
        case Tabs.CHANGE_PASSWORD:
            return (
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
                                        <div className="relative" >
                                            <Input
                                                type={showPassword ? 'text' : 'password'} 
                                                {...field} 
                                            />
                                            <span
                                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600 dark:text-gray-400 cursor-pointer"
                                                onClick={togglePasswordVisibility}
                                            >
                                                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                            </span>
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-red-500"  />
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
                                        <div className="relative" >
                                            <Input
                                                type={showConfirmPassword ? 'text' : 'password'} 
                                                {...field} 
                                            />
                                            <span
                                                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600 dark:text-gray-400 cursor-pointer"
                                                onClick={toggleConfirmPasswordVisibility}
                                            >
                                                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                            </span>
                                        </div>
                                    </FormControl>
                                    <FormMessage className="text-red-500"  />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit">Change Password</Button>
                        </form>
                    </Form>
                </div>
            );
        default:
            break;
    }
}