'use client'
import { useToast } from "@/hooks/use-toast";
import { Copy } from "lucide-react";

export default function CommandCopy({ command, description, disabled }: { command: string, description?: string, disabled?: boolean }) {

    const { toast } = useToast();
    return (
        <div className="flex flex-col">
            <div className="flex flex-row">
                <code className="text-stone-900 text-sm border border-stone-900 p-2 overflow-hidden whitespace-nowrap">{command}</code>
                <button
                    className={`border border-l-0 border-stone-900 flex flex-col items-center justify-center align-middle bg-stone-900 text-white hover:bg-white hover:text-stone-900 aspect-square w-9 ${disabled ? "opacity-50 cursor-not-allowed hover:bg-stone-900 hover:text-white" : ""}`}
                    onClick={() => {
                        if (disabled) return;
                        navigator.clipboard.writeText(command);
                        toast({
                            title: "Copied to clipboard!",
                            description: "You can now paste the command into your terminal.",
                        });
                    }}
                >
                    <Copy className="w-4 h-4 " />
                </button>
            </div>
            {description && <p className="text-stone-900 text-xs mt-1">{description}</p>}
        </div>

    );
}