import GradientBackground from "./GradientBackground";

export default function HeroWrapper({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <section className={`${className} overflow-hidden`}>
            <div className="pt-24 w-screen z-10 bg-transparent">
                {children}
            </div>
            <div>
            <GradientBackground className="h-[100%]" />
            </div>
        </section>
    );
}