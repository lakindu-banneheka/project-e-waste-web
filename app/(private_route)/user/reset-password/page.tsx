import { AuthBackground } from "@/components/auth/auth-background";
import Image from "next/image";
import React from "react";
import logo from '@/assets/logo/ewaste_logo 1.png';

const ResetPassword = () => {
    return (
        <>
            <div className="w-full lg:grid lg:grid-cols-2">
                <AuthBackground />
                <div className="flex items-center justify-center py-12">
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
                    </div>
                </div>
            </div>
        </>
    );
}

export default ResetPassword;