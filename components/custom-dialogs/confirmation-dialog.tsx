import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { Button } from "../ui/button";
  
  interface ConfirmationDialogProps {
    triggerBtnLable: string;
    confirmationTopic: string;
    confirmationDescription: string;
    confirmBtnLable?: string;
    triggerBtnStyles?: string;
    confirmBtnStyles?: string;
    confirmBtnVarient?: "default" | "link" | "secondary" | "destructive" | "outline" | "ghost" | null | undefined;
    triggerBtnVarient?: "default" | "link" | "secondary" | "destructive" | "outline" | "ghost" | null | undefined;
    disabled?: boolean;
    onConfirm: ()=>void;
  }
export const ConfirmationDialog = ({
    triggerBtnLable,
    triggerBtnStyles,
    triggerBtnVarient,
    confirmationTopic,
    confirmationDescription,
    confirmBtnLable,
    confirmBtnStyles,
    confirmBtnVarient,
    onConfirm,
    disabled=false
}: ConfirmationDialogProps) => {

    return (
        <>
            <Dialog>
                <DialogTrigger asChild>
                    <Button 
                        className={triggerBtnStyles} 
                        variant={triggerBtnVarient || "outline"}
                        disabled={disabled}
                    >
                        {triggerBtnLable}
                    </Button>
                </DialogTrigger>
                <DialogContent className="border-none" >
                    <DialogHeader>
                    <DialogTitle className="font-normal" >{confirmationTopic}</DialogTitle>
                    <DialogDescription>
                        {confirmationDescription}
                    </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button 
                            variant={confirmBtnVarient}
                            className={confirmBtnStyles}
                            onClick={onConfirm}
                        >
                            {confirmBtnLable || "Confirm"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}