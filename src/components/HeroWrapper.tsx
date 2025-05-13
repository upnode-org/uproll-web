export default function HeroWrapper({
  children,
  className,
  backgroundElement
}: {
  children: React.ReactNode;
  className?: string;
  backgroundElement?: React.ReactNode;
}) {
  return (
    <section className={`${className} relative overflow-hidden`}>
      {backgroundElement}
      
      {/* Content is placed on top */}
      <div className="relative pt-19 sm:pt-21">
        {children}
      </div>
    </section>
  );
}
