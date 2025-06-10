import ChatSectionWrapper from "@/app/assistant/components/ChatSectionWrapper";
import React, { Suspense } from "react";
import Messages from "../components/Messages";
import MessagesSuspenseFallback from "../components/MessagesSuspenseFallback";

export default function SelectedChatPage({
  params,
}: {
  params: Promise<{ chatId: string }>;
}) {
  const resolvedParams = React.use(params);
  const chatId = resolvedParams.chatId;
  console.log(chatId)
  return <>
    <ChatSectionWrapper>
      <Suspense fallback={<MessagesSuspenseFallback/>}>
        <Messages chatId={chatId}/>
      </Suspense>
    </ChatSectionWrapper>
  </>;
}
