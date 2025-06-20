
export default function ChatSectionWrapper({children}: {children: React.ReactNode}) {
  
  return (
    <div className="relative flex flex-col h-full items-center">
      <section className="flex-grow w-full">
        {children}
      </section>
    </div>
  );
}
