'use client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import VerifyEmailMobileStepperForm from "./verify-email-mobile-stepper-form"
import { Button } from "@/components/ui/button"

interface VerifyEmailMobileDialogProps {
  isOpen?:boolean; 
  triggerButton?: boolean;
	is_email_verified: boolean;
	is_phoneno_verified: boolean;
	user_id: string;
	email: string;
	phoneno: string;
}

export function VerifyEmailMobileDialog({
  isOpen=false, 
  triggerButton=false,
  is_email_verified,
	is_phoneno_verified,
	user_id,
	email,
	phoneno,
}:VerifyEmailMobileDialogProps) {
    // ask for good content

  return (
    <Dialog
        open={isOpen}
    >
      {triggerButton 
        ?<DialogTrigger asChild>
          <Button variant="outline">Edit Profile</Button>
        </DialogTrigger>
        :<></>
      }
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Verify your Email and Phone Number</DialogTitle>
          {/* <DialogDescription>
            Verify your Email and Phone Number
          </DialogDescription> */}
        </DialogHeader>
        <div className="flex justify-center items-center p-3">
            <VerifyEmailMobileStepperForm 
              email={email}
              is_email_verified={is_email_verified}
              user_id={user_id}
              phoneno={phoneno}
              is_phoneno_verified={is_phoneno_verified}
            />
        </div>
      </DialogContent>
        
    </Dialog>
  )
}

