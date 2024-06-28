'use client'
import { AuthBackground } from "@/components/auth/auth-background";
import logo from '@/assets/logo/ewaste_logo 1.png';
import Image from "next/image";
import React from "react";
import { z } from "zod";
import { passwordSchema, universityEmailSchema } from "@/utils/user-validation";
import ForgotPasswordStepperForm from "@/components/forgot-password/forgot-password-stepper-form";

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
                        <ForgotPasswordStepperForm 

                        />
                    </div>
                </div>
            </div>
        </>
    );
}

export default ForgotPassword;