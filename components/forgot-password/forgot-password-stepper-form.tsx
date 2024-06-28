"use client";
import { Step, StepItem, Stepper, useStepper } from "@/components/stepper";
import { Button } from "@/components/ui/button";
import { InputOTPForm } from "@/components/InputOTPForm";
import { Eye, EyeOff, KeyRound, Mail, RectangleEllipsis } from "lucide-react";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { passwordSchema, universityEmailSchema } from "@/utils/user-validation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { sendOTPMail, verifyEmail } from "@/server/emails/otp-mail";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const steps = [
	{ label: "Email", icon: Mail }, 
	{ label: "OTP", icon: KeyRound },
	{ label: "Change Password", icon: RectangleEllipsis },
] satisfies StepItem[];

interface ForgotPasswordStepperFormProps {
	
}

export default function ForgotPasswordStepperForm({
	
}: ForgotPasswordStepperFormProps) {
	const router = useRouter();

	const [email, setEmail] = useState<string>('');
	const { 
        mutate: server_sendOTPMail,
        isPending,
		isSuccess,
    } = useMutation({
        mutationFn: sendOTPMail,
        onSuccess: () => {
            toast.success(`One-time password has been sent to your email.`);
        },
        onError(error, variables, context) {
            toast.error(error.message);
        },
    });
	
	const sendOTPReq = async ({email}:{email: string}) => {
		server_sendOTPMail({
            email: 'lakindu2001l@gmail.com'
        });
		return await isSuccess;
	}

	return (
		<div className="flex w-full flex-col gap-4">
			<Stepper variant="circle-alt" initialStep={0} steps={steps}>
				{steps.map((stepProps, index) => {
					if (index === 0) {
						return (
							<Step key={stepProps.label} {...stepProps}>
								<div className="h-40 w-100 flex items-center justify-center my-2rounded-md">
									<FirstStepForm 
										setEmail={setEmail}
										sendOTPReq={sendOTPReq}
										isPending={isPending}
									/>
								</div>
							</Step>
						);
					} else if(index === 1){
						return (
							<Step key={stepProps.label} {...stepProps}>
								<div className="h-40 w-100 flex items-center justify-center my-2rounded-md">
									<SecondStepForm 
										email={email}
										sendOTPReq={sendOTPReq}
										isResendEmailPending={isPending}
									/>
								</div>
							</Step>
						);
					}
					return (
						<Step key={stepProps.label} {...stepProps}>
							<div className="h-40 w-100 flex items-center justify-center my-2rounded-md">
								<ThirdStepForm 
									
								/>
							</div>
						</Step>
					);
				})}
				<MyStepperFooter 
					router={router}
				/>
			</Stepper>
		</div>
	);
}


// First Step Form
const FormEmailSchema = z.object({
    email: universityEmailSchema
})

interface FirstStepFormProps {
	setEmail: React.Dispatch<React.SetStateAction<string>>;
	sendOTPReq: ({email}:{email: string}) => Promise<boolean>;
	isPending: boolean;
}

function FirstStepForm({
	setEmail,
	sendOTPReq,
	isPending

}: FirstStepFormProps) {
	const { nextStep } = useStepper();
    
    const email_form = useForm<z.infer<typeof FormEmailSchema>>({
        resolver: zodResolver(FormEmailSchema),
    });

    async function onSubmit (data: z.infer<typeof FormEmailSchema>) {
        setEmail(data.email);
		const isSuccess = await sendOTPReq({email: data.email});
		nextStep();
    }

	return (
		<div className="w-100" >
			<div>
                <Form {...email_form}>
                    <form onSubmit={email_form.handleSubmit(onSubmit)} className="w-full space-y-3">
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
                        <Button type="submit" disabled={isPending}>Send OTP</Button>
                    </form>
                </Form>
            </div>
		</div>
	);
}


// Second Step Form
interface SecondStepFormProps {
    email: string;
	sendOTPReq: ({email}:{email: string}) => void;
	isResendEmailPending: boolean;
}

function SecondStepForm({
	email,
	sendOTPReq,
	isResendEmailPending
}: SecondStepFormProps) {
	const { nextStep } = useStepper();
	console.log(email, sendOTPReq);
	const { 
        mutate: server_verifyEmail,
        isPending,
    } = useMutation({
        mutationFn: verifyEmail,
        onSuccess: () => {
            toast.success(`OTP Verified`);
            nextStep();
        },
        onError(error, variables, context) {
            toast.error(error.message);
        },
    });

    function otpVerification({pin}: {pin: string}) {
        console.log('pin', pin, email);
		server_verifyEmail({email: email, otp: pin});
    }

	const handleResendOTP = () => {
        console.log(email);
		sendOTPReq({email: email});
    }

	return (
		<div className="w-100" >
			<InputOTPForm
                label='One-Time Password'
                formDescription='Please enter the one-time password sent to your email.'
                buttonLabel='Verify'
                otpVerification={otpVerification}
				handleResendOTP={handleResendOTP}
				isPending={isPending}
            />
			{/* <Button>Back</Button> */}
		</div>
	);
}


// Third Step Form
interface thirdStepFormProps {

}

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

function ThirdStepForm({

}: thirdStepFormProps ){
	const { nextStep } = useStepper();

	const password_form = useForm<z.infer<typeof FormPasswordSchema>>({
        resolver: zodResolver(FormPasswordSchema),
    });

	const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const togglePasswordVisibility = () => {
    	setShowPassword(!showPassword);
    };
    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    function onSubmitPasswordChange(data: z.infer<typeof FormPasswordSchema>) {
        console.log(data.password);

        // send to update password 

        // if ok
        toast.success(`Password Changed successfuly.`);
		nextStep();
        // else
        // toast.error(`failed.`); // add the error to description

    }

	return(
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
}

// function StepperFormActions() {
// 	const {
// 		prevStep,
// 		resetSteps,
// 		isDisabledStep,
// 		hasCompletedAllSteps,
// 		isLastStep,
// 	} = useStepper();

// 	return (
// 		<div className="w-full flex justify-end gap-2">
// 			{hasCompletedAllSteps ? (
// 				<Button size="sm" type="button" onClick={resetSteps}>
// 					Reset
// 				</Button>
// 			) : (
// 				<>
// 					<Button
// 						disabled={isDisabledStep}
// 						onClick={prevStep}
// 						size="sm"
// 						variant="secondary"
// 						type="button"
// 					>
// 						Prev
// 					</Button>
// 					<Button size="sm" type="submit">
// 						{isLastStep ? "Finish" : "Next"}
// 					</Button>
// 				</>
// 			)}
// 		</div>
// 	);
// }

function MyStepperFooter({router}: {router: AppRouterInstance }) {
	const { activeStep, resetSteps, steps } = useStepper();

	if (activeStep !== steps.length) {
		return null;
	}

	return (
		<div className="flex items-center justify-center gap-2 w-100 mt-8">
			<Button 
				onClick={()=>{
					router.push('/auth/login')
				}}
			>
				Login
			</Button>
		</div>
	);
}