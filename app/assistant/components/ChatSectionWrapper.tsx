"use client";
import { deleteChat, insertNewMessage } from "@/actions/chat.action";
import React, { useActionState } from "react";
import ChatInputBox from "./ChatInputBox";
import { Trash2 } from "lucide-react";
import { usePathname } from "next/navigation";
import LoadingScreen from "@/components/LoadingScreen";

export default function ChatSectionWrapper({children}: {children: React.ReactNode}) {
  const [state, action, pending] = useActionState(insertNewMessage, undefined);
  const [stateOfDeleteChat, actionToDeleteChat, pendingOfDeleteChat] = useActionState(deleteChat, undefined);

  const pathname = usePathname();
  const chatId = pathname.split('/assistant/')[1]
  return (
    <div className="relative flex flex-col h-full items-center">
      {pendingOfDeleteChat && <LoadingScreen message="Deleting this chat..."/>}
      {/* Delete Current Chat Button */}
      <div
        className={`absolute p-2 right-4 opacity-90 hover:opacity-100 backdrop-blur-md flex flex-col gap-4 rounded-bl-lg justify-between items-center border-b-2 border-l-2 z-0 transition-all duration-300`}
      >
        <form action={actionToDeleteChat}>
          <input type="text" name="chatId" value={chatId} readOnly hidden />
          <button type="submit" className="p-2">
            <Trash2 size={24}/>
          </button>
        </form>
      </div>
      {/* Messages Section */}
      <section className="flex-grow w-full">
        {children}
      </section>
      {/* Input Box with chatId with every message*/}
      <ChatInputBox action={action} pending={pending} additionalInputElement={<input type="text" name="chatId" readOnly hidden value={chatId}/>}/>
    </div>
  );
}
