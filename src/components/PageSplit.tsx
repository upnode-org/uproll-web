export default function PageSplit({
  asideElement,
  mainElement,
  className,
  backgroundElement
}: {
  asideElement: React.ReactNode;
  mainElement: React.ReactNode;
  className?: string;
  backgroundElement?: React.ReactNode;

}) {
  return (
    <section className={`flex flex-row size-full h-screen`}>
      {backgroundElement}
      <div className="flex flex-row size-full h-screen">
        <aside className="pt-24 w-full hidden md:block h-full border-r border-stone-900">
          {asideElement}
      </aside>
      <main className={`pt-24 w-full ${className}`}>
          {mainElement}
        </main>
      </div>
    </section>
  );
}
