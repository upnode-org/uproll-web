import { useToast } from "@/hooks/use-toast";
import { Copy } from "lucide-react";

export default function CommandCopy({ command, description }: { command: string, description?: string }) {

    const { toast } = useToast();
    return (
        <div className="flex flex-col">
            <div className="flex flex-row">
                <p className="text-stone-900 text-sm border border-stone-900 p-2 overflow-hidden whitespace-nowrap">{command}</p>
                <button
                    className="border border-l-0 border-stone-900 flex flex-col items-center justify-center align-middle bg-stone-900 text-white hover:bg-white hover:text-stone-900 aspect-square w-9"
                    onClick={() => {
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