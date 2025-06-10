import ChatSection from "@/app/assistant/components/ChatSection";
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
