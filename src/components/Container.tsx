import { cn } from "@/lib/utils";

export default function Container({ children, className }: { children: React.ReactNode, className?: string }) {
  return <div className={cn("container mx-auto px-4 max-w-5xl", className)}>{children}</div>;
}
