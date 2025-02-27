'use client'
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Copy } from "lucide-react";

export default function CommandCopy({ command, description, disabled }: { command: string, description?: string, disabled?: boolean }) {
  const { toast } = useToast();

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row w-full border border-stone-900">
        <code className="flex-1 min-w-0 text-stone-900 bg-white text-sm border-r border-stone-900 p-2 truncate">
          {command}
        </code>
        <button
          className={cn(
            `flex flex-col items-center justify-center align-middle bg-stone-900 text-white hover:bg-white hover:text-stone-900 aspect-square w-9 ${
              disabled ? "cursor-not-allowed !text-stone-500 hover:bg-stone-900" : ""
            }`
          )}
          onClick={() => {
            if (disabled) return;
            navigator.clipboard.writeText(command);
            toast({
              title: "Copied to clipboard!",
              description: "You can now paste the command into your terminal.",
            });
          }}
        >
          <Copy className="w-4 h-4" />
        </button>
      </div>
      {description && <p className="text-stone-900 text-xs mt-1">{description}</p>}
    </div>
  );
}
