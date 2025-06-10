"use client";
import { deleteChat, insertNewMessage } from "@/actions/chat.action";
import React, { useActionState } from "react";
import ChatInputBox from "./ChatInputBox";
import { Trash2 } from "lucide-react";
import { usePathname } from "next/navigation";
import Messages from "./Messages";

export default function ChatSectionWrapper({children}: {children: React.ReactNode}) {
  const [state, action, pending] = useActionState(insertNewMessage, undefined);
  const [stateOfDeleteChat, actionToDeleteChat, pendingOfDeleteChat] =
    useActionState(deleteChat, undefined);

  const pathname = usePathname();
  const chatId = pathname.split('/assistant/')[1]
  return (
    <div className="relative flex flex-col h-full items-center">
      {/* Delete Current Chat Button */}
      <div
        className={`absolute p-2 right-0 bg-light-1 dark:bg-dark-4 flex flex-col gap-4 rounded-bl-lg justify-between items-center border-b-2 border-l-2 z-10 transition-all duration-300`}
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
      <ChatInputBox action={action} aditionalInputElement={<input type="text" name="chatId" readOnly hidden value={chatId}/>}/>
    </div>
  );
}
