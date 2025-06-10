"use client"
import { insertNewMessage } from "@/actions/chat.action";
import { useActionState } from "react";
import ChatInputBox from "./ChatInputBox";

export default function ChatSection() {
  const [state, action, pending] = useActionState(insertNewMessage, undefined)
  return (
    <div className="relative flex flex-col h-full items-center">
      {/* Messages Section */}
      <section className="flex-grow w-full"></section>
      {/* Input Box */}
      <ChatInputBox action={action}/>
    </div>
  );
}
