import ChatSidebarWrapper from "@/app/assistant/components/ChatSidebarWrapper";
import { Suspense } from "react";
import ChatListSuspenseFallback from "./components/fallback/ChatListSuspenseFallback";
import ChatsList from "@/app/assistant/components/ChatsList";

function AssistantLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  
  return (
    <>
      <section className="w-full max-w-[1920px] h-[calc(100vh-64px)] min-h-52 flex">
        {/* Sidebar */}
        <ChatSidebarWrapper>
          <Suspense fallback={<ChatListSuspenseFallback/>}>
            <ChatsList/>
          </Suspense>
        </ChatSidebarWrapper>
        {/* Chat */}
        <div className="flex-1 ">{children}</div>
      </section>
    </>
  );
}

export default AssistantLayout;
