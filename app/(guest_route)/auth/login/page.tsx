'use client'
import Image from "next/image"
import Link from "next/link"
import logo from '@/assets/logo/ewaste_logo 1.png';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { signIn } from 'next-auth/react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserRole } from "@/types/User";
import { AuthBackground } from "@/components/auth/auth-background";
import { universityEmailSchema, userRoleSchema } from "@/utils/user-validation";

const schema = z.object({
    role: userRoleSchema,
    email: universityEmailSchema,
    password: z.string(),
  });
  
  type FormFields = z.infer<typeof schema>;
  

const Login = () => {

    const { 
        register, 
        handleSubmit,
        setError,
        setValue, 
        formState: {errors, isSubmitting} 
    } = useForm<FormFields>({ 
        resolver: zodResolver(schema),
    });

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        console.log(data);
        
        // try {
        //     // await new Promise((resolve) => setTimeout(resolve,1000));
        //     console.log(data);
        //     const { email, password } = data;
            
        //     const res = await signIn("credentials", {
        //         email,
        //         password,
        //         redirect: false,
        //     });
          
        //     router.replace('/'); // to the route after login

        // } catch (err) { 
        //     setError("root", {
        //         type: "manual",
        //         message: "The email address or password is incorrect. ",
        //     });
        // }
    }
    
    // {errors.root && (
    //     <div className="text-red-500 mb-4 text-sm" >{errors.root.message}</div>
    // )}

    return (
        <>
            <div className="w-full lg:grid  lg:grid-cols-2">
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
                                    className=" " // dark:grayscale
                                />
                            </div>
                        </div>
                        <div className="grid gap-2 text-center">
                            <h1 className="text-3xl font-bold">
                                Sign in to Dashboard
                            </h1>
                            
                        </div>
                        <form 
                            className="grid gap-4"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <div className="grid gap-2" >
                                <Label htmlFor="account-type">Account Type</Label>
                                <Select 
                                    onValueChange={(value) => setValue('role', value === UserRole.Contributor ? UserRole.Contributor : UserRole.Admin)}
                                    defaultValue={UserRole.Contributor}
                                    {...register("role")}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Account Type" />
                                    </SelectTrigger>
                                    <SelectContent >
                                        <SelectItem value={UserRole.Contributor}>Contributor</SelectItem>
                                        <SelectItem value={UserRole.Admin}>Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.role && (
                                    <div className="text-red-500 text-xs" >{errors.role.message}</div>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    {...register("email")}
                                    id="email"
                                    type="email"
                                    placeholder="example@stu.kln.ac.lk"
                                    // required
                                />
                                {errors.email && (
                                    <div className="text-red-500 text-xs" >{errors.email.message}</div>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="password">Password</Label>
                                </div>
                                <Input 
                                    {...register("password")}
                                    id="password" 
                                    type="password" 
                                    // required 
                                />
                                {errors.password && (
                                    <div className="text-red-500 text-xs" >{errors.password.message}</div>
                                )}
                            </div>
                            <Link
                                href="/forgot-password"
                                className="ml-auto inline-block text-sm underline"
                            >
                                Forgot password?
                            </Link>
                            <Button 
                                type="submit" 
                                className="w-full text-gray-50 font-semibold text-md"

                            >
                                Login
                            </Button>
                        </form>
                        <div className="mt-4 text-center text-sm">
                            Don&apos;t have an account?{" "}
                            <Link href="/auth/register" className="underline text-primary">
                                Sign up
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Login;