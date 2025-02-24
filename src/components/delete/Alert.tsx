"use client"
import React from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { OctagonAlert, Trash2, X } from "lucide-react";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { isPromise } from "@/lib/utils";

type TriggerProps =
  | { triggerComponent: React.ReactNode; triggerText?: never }
  | { triggerComponent?: undefined; triggerText?: React.ReactNode };

interface BaseProps {
    /** Optional custom icon for the header; defaults to a destructive icon */
    icon?: React.ReactNode;
    /** Title displayed in the top header section (next to the icon) */
    title: string;
    /** Description text providing more details in the dialog */
    description: string;
    /** Handler function called when the "continue" button is clicked */
    onContinue: () => void | Promise<void>;
    /** Optional custom text for the cancel button */
    cancelText?: string;
    /** Optional custom text for the continue button */
    continueText?: string;
}

type ModalAlertProps = TriggerProps & BaseProps;

const ModalAlert: React.FC<ModalAlertProps> = ({
    triggerText,
    triggerComponent,
    icon,
    title,
    description,
    onContinue,
    cancelText = "Cancel",
    continueText = "Continue",
}) => {
    const { toast } = useToast();

    const handleContinue = async () => {
        const result = onContinue();
        if (isPromise(result)) {
            await toast.promise(result, {
                loading: {
                    title: "Deleting config...",
                    description: "Please wait.",
                },
                success: {
                    title: "Success!",
                    description: "Your configuration has been deleted.",
                },
                error: {
                    title: "Error",
                    description: "Failed to delete configuration.",
                    variant: "destructive",
                },
            });
        } else {
            onContinue();
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {triggerComponent ? (
                    triggerComponent
                ) : (
                    <Button variant="destructive" className="p-2">
                        <Trash2 className="w-4 h-4" /> {triggerText && triggerText}
                    </Button>
                )}
            </AlertDialogTrigger>
            <AlertDialogContent>
                <div className="-mt-3 -mx-6 border-b pb-3 px-6 flex justify-between items-center">
                    <AlertDialogTitle className="flex items-center gap-3">
                        <div className="mx-auto sm:mx-0 flex h-9 w-9 items-center justify-center rounded-full bg-destructive/10">
                            {icon || <OctagonAlert className="h-5 w-5 text-destructive" />}
                        </div>
                        {title}
                    </AlertDialogTitle>
                    <AlertDialogPrimitive.Cancel
                        className={buttonVariants({
                            variant: "ghost",
                            size: "icon",
                            className: "!h-7 !w-7",
                        })}
                    >
                        <X />
                    </AlertDialogPrimitive.Cancel>
                </div>
                <AlertDialogHeader className="pt-2">
                    <AlertDialogDescription className="text-[15px]">
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="mt-2">
                    <AlertDialogCancel>{cancelText}</AlertDialogCancel>
                    <AlertDialogAction onClick={handleContinue}>
                        {continueText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default ModalAlert;
