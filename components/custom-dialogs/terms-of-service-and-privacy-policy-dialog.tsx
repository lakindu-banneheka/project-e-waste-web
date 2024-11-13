import React from "react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";

interface ConfirmationDialogProps {
    triggerLabel: string;
    title: string;
    description: string;
    triggerButtonClass?: string;
    triggerButtonVariant?: "default" | "link" | "secondary" | "destructive" | "outline" | "ghost";
    isDisabled?: boolean;
}

export const TermsOfServiceAndPrivacyPolicyDialog = ({
    triggerLabel,
    triggerButtonClass,
    triggerButtonVariant = "outline",
    title,
    description,
    isDisabled = false,
}: ConfirmationDialogProps) => {

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button 
                    className={triggerButtonClass} 
                    variant={triggerButtonVariant}
                    disabled={isDisabled}
                >
                    {triggerLabel}
                </Button>
            </DialogTrigger>
            <DialogContent className="border-none">
                <DialogHeader>
                    <DialogTitle className="font-normal">{title}</DialogTitle>
                    <DialogDescription>{description}</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};


export const TermsOfServiceDialog = ({
    isDisabled = false,
}: {isDisabled?: boolean}) => {

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button 
                    className={'text-primary/80 underline p-0 m-0'} 
                    variant={'link'}
                    disabled={isDisabled}
                >
                    {'Terms of Service'}
                </Button>
            </DialogTrigger>
            <DialogContent className="border-none">
                <DialogHeader>
                    <DialogTitle className="font-normal">{'Terms of Service'}</DialogTitle>
                    <DialogDescription>{'Terms of Service ....'}</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};


export const PrivacyPolicyDialog = ({
    isDisabled = false,
}: {isDisabled?: boolean}) => {

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button 
                    className={'text-primary/80 underline p-0 m-0'} 
                    variant={'link'}
                    disabled={isDisabled}
                >
                    {'Privacy Policy'}
                </Button>
            </DialogTrigger>
            <DialogContent className="border-none">
                <DialogHeader>
                    <DialogTitle className="font-normal">{'Privacy Policy'}</DialogTitle>
                    <DialogDescription>{'Privacy Policy...'}</DialogDescription>
                </DialogHeader>
                <DialogFooter>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};