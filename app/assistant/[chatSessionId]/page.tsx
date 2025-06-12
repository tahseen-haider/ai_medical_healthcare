import ChatSectionWrapper from "@/app/assistant/components/ChatSectionWrapper";
import React, { Suspense } from "react";
import MessagesSuspenseFallback from "../components/fallback/MessagesSuspenseFallback";
import MessagesWrapper from "../components/MessagesWrapper";

export default function SelectedChatPage({
  params,
}: {
  params: Promise<{ chatSessionId: string }>;
}) {
  const resolvedParams = React.use(params);
  const chatId = resolvedParams.chatSessionId;

  return (
    <>
      <ChatSectionWrapper>
          <Suspense fallback={<MessagesSuspenseFallback />}>
            <MessagesWrapper chatId={chatId} />
          </Suspense>
      </ChatSectionWrapper>
    </>
  );
}
