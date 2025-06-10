"use client";
import { useActionState } from "react";
import { startNewChat } from "@/actions/chat.action";
import NewChatInputBox from "./ChatInputBox";
import ChatInputBox from "./ChatInputBox";

export default function NewChatSection() {
  const [state, action, pending] = useActionState(startNewChat, undefined);
  return (
    <section className="flex flex-col gap-4 w-full h-[calc(100vh-65px)] items-center justify-center">
      <h2 className="font-ubuntu text-4xl tracking-tight leading-12">
        What can I help with?
      </h2>
      <ChatInputBox action={action} />
      {state?.message && <p className="text-red-400">{state?.message}</p>}
    </section>
  );
}
