"use client";
// import { deleteChat } from "@/actions/chat.action";
import React, { useActionState } from "react";
// import { Trash2 } from "lucide-react";
import { usePathname } from "next/navigation";
import LoadingScreen from "@/components/LoadingScreen";
// import DeleteChatBtn from "./DeleteChatBtn";

export default function ChatSectionWrapper({children}: {children: React.ReactNode}) {
  // const [stateOfDeleteChat, actionToDeleteChat, pendingOfDeleteChat] = useActionState(deleteChat, undefined);

  const pathname = usePathname();
  const chatId = pathname.split('/assistant/')[1];
  
  return (
    <div className="relative flex flex-col h-full items-center">
      {/* {pendingOfDeleteChat && <LoadingScreen message="Deleting this chat..."/>} */}
      {/* Delete Current Chat Button */}
      {/* <div
        className={`absolute p-2 right-4 opacity-90 hover:opacity-100 backdrop-blur-md flex flex-col gap-4 rounded-b-lg justify-between items-center border-b-2 border-l-2 border-r-2 z-0 transition-all duration-300`}
      >
        <DeleteChatBtn chatId={chatId} actionToDeleteChat={actionToDeleteChat}/>
      </div> */}
      {/* Messages Section */}
      <section className="flex-grow w-full">
        {children}
      </section>
    </div>
  );
}
