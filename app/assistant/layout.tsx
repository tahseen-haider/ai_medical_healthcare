import ChatSidebar from "@/components/chat/ChatSidebar";
import { useEffect, useState } from "react";

function AssistantLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  useEffect(() => {
    const isSmallScreen = window.innerWidth < 1024;
    setIsSidebarOpen(!isSmallScreen)
  }, [])

  return (
    <>
      <section className="w-full max-w-[1920px] h-[calc(100vh-64px)] min-h-52 flex">
        <ChatSidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />
        {/* Chat */}
        <div className="flex-1 ">{children}</div>
      </section>
    </>
  );
}

export default AssistantLayout;
