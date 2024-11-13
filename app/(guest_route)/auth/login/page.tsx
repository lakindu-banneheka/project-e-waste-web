'use client'
import Link from "next/link"
import {  z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { signIn, useSession } from 'next-auth/react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserRole } from "@/types/User";
import { AuthBackground } from "@/components/auth/auth-background";
import { universityEmailSchema, userRoleSchema } from "@/utils/user-validation";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import LogoImage from "@/assets/logo/logo";

const schema = z.object({
    role: userRoleSchema,
    email: universityEmailSchema,
    password: z.string().nonempty({message: 'Password Required'}),
  });
  
  type FormFields = z.infer<typeof schema>;
  

const Login = () => {
    const router = useRouter();
    const { data, status } = useSession();

    const { 
        register, 
        handleSubmit,
        setValue, 
        watch,
        formState: {errors, isSubmitting} 
    } = useForm<FormFields>({ 
        resolver: zodResolver(schema),
    });

    useEffect(() => {
        setValue('role', watch('role'), { shouldValidate: true });
    }, [watch('role'), setValue]);

    const onSubmit: SubmitHandler<FormFields> = async (user) => {
        try {
            const { email, password, role } = user;
            
            const res = await signIn("credentials", {
                role,
                email,
                password,
                redirect: false,
            });
            
            if(!res?.ok){
                toast.error(res?.error);
            } else {
                router.replace('/');
            }
        } catch (error) { 
            toast.error("Someting went wrong.");
        }
    }
    
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

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
                                    // width="200"
                                    // height="80" 
                                    className="w-auto max-w-[200px] min-w-[180px] h-auto"
                                />
                            </div>
                        </div>
                        <div className="grid gap-2 text-center">
                            <h1 className="text-2xl md:text-3xl font-bold">
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
                                    name="email"
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
                                <div className="relative" >
                                    <Input 
                                        {...register("password")}
                                        id="password" 
                                        type={showPassword ? 'text' : 'password'}
                                    />
                                    <span
                                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600 dark:text-gray-400 cursor-pointer"
                                            onClick={togglePasswordVisibility}
                                        >
                                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </span>
                                </div>
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
                                className={`w-full text-gray-50 font-semibold text-md ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={isSubmitting}
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