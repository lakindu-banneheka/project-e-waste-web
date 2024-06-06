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

export function VerifyEmailMobileDialog({isOpen}:{isOpen:boolean}) {
    // ask for good content

  return (
    <Dialog
        // open={isOpen}
    >
      <DialogTrigger asChild>
        <Button variant="outline">Edit Profile</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Verify your Email and Password</DialogTitle>
          <DialogDescription>
            Verify your Email and Password
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-center items-center p-3">
            <VerifyEmailMobileStepperForm />
        </div>
      </DialogContent>
        
    </Dialog>
  )
}

