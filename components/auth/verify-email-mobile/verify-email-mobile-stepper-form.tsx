"use client";

import { Step, StepItem, Stepper, useStepper } from "@/components/stepper";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { InputOTPForm } from "@/components/InputOTPForm";
import { Mail, Phone } from "lucide-react";
import { useRouter } from "next/navigation";

// const steps = [
// 	{ label: "Email", description: "Email Verification" },
// 	{ label: "Phone Number", description: "Phone Number Verification" },
// ];

const steps = [
	{ label: "Email", icon: Mail }, //description: "Email Verification",
	{ label: "Phone Number", icon: Phone }, // description: "Phone Number Verification",
] satisfies StepItem[];

export default function VerifyEmailMobileStepperForm() {
	return (
		<div className="flex w-full flex-col gap-4">
			<Stepper variant="circle-alt" initialStep={0} steps={steps}>
				{steps.map((stepProps, index) => {
					if (index === 0) {
						return (
							<Step key={stepProps.label} {...stepProps}>
								<div className="h-40 w-100 flex items-center justify-center my-2rounded-md">
									<FirstStepForm />
								</div>
							</Step>
						);
					}
					return (
						<Step key={stepProps.label} {...stepProps}>
							<div className="h-40 w-100 flex items-center justify-center my-2rounded-md">
								<SecondStepForm />
							</div>
						</Step>
					);
				})}
				<MyStepperFooter />
			</Stepper>
		</div>
	);
}


function FirstStepForm() {
	const { nextStep } = useStepper();

	function onSubmit({pin}: {pin: string}) {
		console.log('email pin', pin);
		
		// after verification
		nextStep();
		toast({
			title: "Email verified",
		});
	}

	return (
		<div className="w-100" >
			<InputOTPForm 
				label="Email Verification OTP"
				otpVerification={onSubmit}
			/>
		</div>
	);
}

function SecondStepForm() {
	const { nextStep } = useStepper();

	function onSubmit({pin}: {pin: string}) {
		console.log('mobile pin', pin);
		
		// after verification
		nextStep();
		toast({
			title: "Email verified",
		});
	}

	return (
		<div className="w-100" >
			<InputOTPForm 
				label="Phone Number Verification OTP"
				otpVerification={onSubmit}
			/>
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

function MyStepperFooter() {
	const { activeStep, resetSteps, steps } = useStepper();

	if (activeStep !== steps.length) {
		return null;
	}
	const router = useRouter();

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