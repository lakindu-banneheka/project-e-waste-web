'use client'
import { AuthBackground } from "@/components/auth/auth-background";
import logo from '@/assets/logo/ewaste_logo 1.png';
import Image from "next/image";
import React from "react";
import { z } from "zod";
import { passwordSchema, universityEmailSchema } from "@/utils/user-validation";
import ForgotPasswordStepperForm from "@/components/forgot-password/forgot-password-stepper-form";
import LogoImage from "@/assets/logo/logo";

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

    return (
        <>
            <div className="w-full h-full lg:grid lg:grid-cols-2">
                <div className="w-full h-full lg:fixed lg:inset-y-0 lg:left-0 lg:w-1/2">
                    <AuthBackground />
                </div>
                <div className="flex items-center justify-center py-12 lg:col-start-2 h-full overflow-y-auto px-10">
                    <div className="mx-auto grid w-[350px] gap-6">
                        <div className="grid gap-2 w-full" >
                            <div className="flex justify-center w-full items-center" >
                                <LogoImage
                                    alt="logo"
                                    // width="200"
                                    // height="80" 
                                    className="w-auto max-w-[200px] min-w-[180px] h-auto"
                                />
                            </div>
                        </div>
                        <div className="grid gap-2 text-center">
                        <h1 className="text-2xl md:text-3xl font-bold">
                                Reset Password
                            </h1>
                        </div>
                        <ForgotPasswordStepperForm 

                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default ForgotPassword;