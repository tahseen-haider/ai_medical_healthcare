import ChatSection from "@/components/chat/ChatSection";
import React from "react";

export default function SelectedChatPage({
  params,
}: {
  params: Promise<{ chatSessionId: string }>;
}) {
  const { chatSessionId } = React.use(params);
  return <>
    <ChatSection/>
  </>;
}
