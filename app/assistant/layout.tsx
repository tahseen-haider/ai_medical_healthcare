import ChatSidebarWrapper from "@/app/assistant/components/ChatSidebar";
import ChatsListWrapper from "@/app/assistant/components/ChatsListWrapper";
import { Suspense } from "react";
import ChatListSuspenseFallback from "./components/ChatListSuspenseFallback";

function AssistantLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  
  return (
    <>
      <section className="w-full max-w-[1920px] h-[calc(100vh-64px)] min-h-52 flex">
        <ChatSidebarWrapper>
          <Suspense fallback={<ChatListSuspenseFallback/>}>
            <ChatsListWrapper/>
          </Suspense>
        </ChatSidebarWrapper>
        {/* Chat */}
        <div className="flex-1 ">{children}</div>
      </section>
    </>
  );
}

export default AssistantLayout;
