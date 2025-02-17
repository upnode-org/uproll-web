import HeroWrapper from "@/components/HeroWrapper";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <HeroWrapper className="bg-red-500">
            {children}
        </HeroWrapper>
    );
}