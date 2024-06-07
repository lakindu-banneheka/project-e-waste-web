'use client'
import Image from "next/image"
import Link from "next/link"
import logo from '@/assets/logo/ewaste_logo 1.png';
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserRole } from "@/types/User";
import { AuthBackground } from "@/components/auth/auth-background";
import { firstNameSchema, lastNameSchema, passwordSchema, phoneNumberSchema, universityEmailSchema, universityIdSchema, userNameSchema, userRoleSchema } from "@/utils/user-validation";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { createUser } from "@/server/user";

const schema = z.object({
    role: userRoleSchema,
    email: universityEmailSchema,
    firstName: firstNameSchema,
    lastName: lastNameSchema,
    userName: userNameSchema,
    universityId: universityIdSchema,
    phoneNo: phoneNumberSchema,
    isTermsAccepted: z.boolean().refine(isTermsAccepted => isTermsAccepted === true, {
        message: "Terms must be accepted",
    }),
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
  
type FormFields = z.infer<typeof schema>;

const Login = () => {
    const router = useRouter();

    const { 
        register, 
        handleSubmit,
        watch,
        setValue,
        formState: {errors, isSubmitting} 
    } = useForm<FormFields>({ 
        resolver: zodResolver(schema),
        defaultValues: {
            role: UserRole.Contributor,
            isTermsAccepted: false,
        }
    });

    const { 
        mutate: server_createUser,
        isPending,
    } = useMutation({
        mutationFn: createUser,
        onSuccess: () => {
            toast.success("New Contributer has been created.");
            router.push('/auth/login');
        },
        onError(error, variables, context) {
            toast.error(error.message);
        },
    })

    useEffect(() => {
        setValue('isTermsAccepted', watch('isTermsAccepted'), { shouldValidate: true });
    }, [watch('isTermsAccepted'), setValue]);

    const onSubmit: SubmitHandler<FormFields> = async (data) => {
        server_createUser({user: data});
    }
    
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword);
    };
    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
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
                                Create Account
                            </h1>
                            
                        </div>
                        <form 
                            className="grid gap-4"
                            onSubmit={handleSubmit(onSubmit)}
                        >
                            <div className="grid gap-2">
                                <Label htmlFor="universityId">Student ID</Label>
                                <Input
                                    {...register("universityId")}
                                    id="universityId"
                                    type="text"
                                    placeholder="xx/xxxx/xxx"
                                    // required
                                />
                                {errors.universityId && (
                                    <div className="text-red-500 text-xs" >{errors.universityId.message}</div>
                                )}
                            </div>
                            <div className="grid grid-cols-2 gap-2" >
                                <div className="grid gap-2">
                                    <Label htmlFor="first-name">First Name</Label>
                                    <Input id="first-name" {...register('firstName')} placeholder="" />
                                    {errors.firstName && (
                                    <div className="text-red-500 text-xs" >{errors.firstName.message}</div>
                                )}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="last-name">Last Name</Label>
                                    <Input id="last-name" {...register('lastName')} placeholder=""  />
                                    {errors.lastName && (
                                    <div className="text-red-500 text-xs" >{errors.lastName.message}</div>
                                )}
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="user-name">User Name</Label>
                                <Input id="user-name" {...register('userName')} placeholder="" />
                                {errors.userName && (
                                    <div className="text-red-500 text-xs" >{errors.userName.message}</div>
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
                                <Label htmlFor="phone-no">Mobile No</Label>
                                <Input
                                    {...register("phoneNo")}
                                    id="phone-no"
                                    type="tel"
                                    placeholder="07x xxx xxxx"
                                    // required
                                />
                                {errors.phoneNo && (
                                    <div className="text-red-500 text-xs" >{errors.phoneNo.message}</div>
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
                                        className="pr-10"
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
                            <div className="grid gap-2">
                                <div className="flex items-center">
                                    <Label htmlFor="confirm-password">Confirm Password</Label>
                                </div>
                                <div className="relative" >
                                    <Input 
                                        {...register("confirmPassword")}
                                        id="confirm-password" 
                                        type={showConfirmPassword ? 'text' : 'password'}
                                        className="pr-10"
                                    />
                                    <span
                                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-600 dark:text-gray-400 cursor-pointer"
                                        onClick={toggleConfirmPasswordVisibility}
                                    >
                                        {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                    </span>
                                </div>
                                {errors.confirmPassword && (
                                    <div className="text-red-500 text-xs">{errors.confirmPassword.message}</div>
                                )}
                            </div>
                            <div className={`flex items-start justify-start space-x-2 ${errors.isTermsAccepted&&'text-red-500'}`}>
                                <Checkbox 
                                    {...register('isTermsAccepted')}
                                    onCheckedChange={(value)=>setValue('isTermsAccepted',Boolean(value))}
                                    id="terms" 
                                    className={`mt-1 ${errors.isTermsAccepted&&'border-red-500'}`} 
                                />
                                <label
                                    htmlFor="terms"
                                    className="text-sm font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    {`By creating an account you agree to our `}
                                    <Link href={''} className="text-primary/80 underline" >
                                        {`Terms Of Service and Privacy Policy.`}
                                    </Link>
                                </label>
                            </div>
                            <Button 
                                type="submit" 
                                className={`w-full text-gray-50 font-semibold text-md transition-all duration-300 ${isSubmitting || isPending ? 'opacity-50 cursor-not-allowed' : ''}`}
                                disabled={isSubmitting || isPending}
                            >
                                {isSubmitting || isPending ? 'Creating new account...' : 'Register'}
                            </Button>
                        </form>
                        <div className="mt-4 text-center text-sm">
                            Already have an account?{" "}
                            <Link href="/auth/login" className="underline text-primary">
                                Sign in
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
    );
}

export default Login;