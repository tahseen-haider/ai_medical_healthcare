import { getChatList } from "@/actions/chat.action";
import { headers } from "next/headers";
import Link from "next/link";
import React from "react";
import ChatList from "./ChatList";

export default async function ChatsListWrapper() {
  const chatsList = await getChatList();

  const headersList = await headers();
  const pathname = headersList.get('x-url') || ''

  const chatId = pathname.split("/assistant/")[1];
  return (
    <div className="flex flex-col gap-2">
      <ChatList chatsList={chatsList}/>
    </div>
  );
}
