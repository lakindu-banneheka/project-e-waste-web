"use client";
import { Step, StepItem, Stepper, useStepper } from "@/components/stepper";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { InputOTPForm } from "@/components/InputOTPForm";
import { Mail, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

const steps = [
	{ label: "Email", icon: Mail }, //description: "OTP was sent to la***.ac.lk",
	{ label: "Phone Number", icon: Phone }, // description: "Phone Number Verification",
] satisfies StepItem[];

interface VerifyEmailMobileStepperFormProps {
	is_email_verified: boolean;
	is_phoneno_verified: boolean;
	user_id: string;
	email: string;
	phoneno: string;
}

export default function VerifyEmailMobileStepperForm({
	is_email_verified,
	is_phoneno_verified,
	user_id,
	email,
	phoneno,
}: VerifyEmailMobileStepperFormProps) {

	const router = useRouter();

	return (
		<div className="flex w-full flex-col gap-4">
			<Stepper variant="circle-alt" initialStep={0} steps={steps}>
				{steps.map((stepProps, index) => {
					if (index === 0) {
						return (
							<Step key={stepProps.label} {...stepProps}>
								<div className="h-40 w-100 flex items-center justify-center my-2rounded-md">
									<FirstStepForm 
										email={email}
										is_email_verified={is_email_verified}
										user_id={user_id}
									/>
								</div>
							</Step>
						);
					}
					return (
						<Step key={stepProps.label} {...stepProps}>
							<div className="h-40 w-100 flex items-center justify-center my-2rounded-md">
								<SecondStepForm 
									phoneno={phoneno}
									is_phoneno_verified={is_phoneno_verified}
									user_id={user_id}
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

interface FirstStepFormProps {
	is_email_verified: boolean;
	user_id: string;
	email: string;
}

function FirstStepForm({
	is_email_verified,
	user_id,
	email,
}:FirstStepFormProps) {
	const { nextStep } = useStepper();
	
	if(is_email_verified){
		nextStep();
	}

	function onSubmit({pin}: {pin: string}) {
		console.log('email pin', pin);
		// user_id as a params to update the user schema
		
		// after verification
		nextStep();
		toast({
			title: "Email verified",
		});
	}

	return (
		<div className="w-100" >
			{/* <InputOTPForm

				label="Email Verification OTP"
				otpVerification={onSubmit}
				formDescription={`OTP was sent to ${email}`}
			/> */}
		</div>
	);
}


interface SecondStepFormProps {
	user_id: string;
	is_phoneno_verified: boolean;
	phoneno: string;
}

function SecondStepForm({
	is_phoneno_verified,
	user_id,
	phoneno,
}: SecondStepFormProps) {
	const { nextStep } = useStepper();
	
	if(is_phoneno_verified){
		nextStep();
	}
	
	function onSubmit({pin}: {pin: string}) {
		console.log('mobile pin', pin);
		
		// user_id as a params to update the user schema
		// after verification
		nextStep();
		toast({
			title: "Phone number verified",
		});
	}

	return (
		<div className="w-100" >
			{/* <InputOTPForm 
				label="Phone Number Verification OTP"
				otpVerification={onSubmit}
				formDescription={`OTP was sent to ${phoneno}`}
			/> */}
		</div>
	);
}

function StepperFormActions() {
	const {
		prevStep,
		resetSteps,
		isDisabledStep,
		hasCompletedAllSteps,
		isLastStep,
	} = useStepper();

	return (
		<div className="w-full flex justify-end gap-2">
			{hasCompletedAllSteps ? (
				<Button size="sm" type="button" onClick={resetSteps}>
					Reset
				</Button>
			) : (
				<>
					<Button
						disabled={isDisabledStep}
						onClick={prevStep}
						size="sm"
						variant="secondary"
						type="button"
					>
						Prev
					</Button>
					<Button size="sm" type="submit">
						{isLastStep ? "Finish" : "Next"}
					</Button>
				</>
			)}
		</div>
	);
}

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