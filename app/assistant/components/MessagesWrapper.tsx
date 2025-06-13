import { getMessages } from "@/actions/chat.action";
import React from "react";
import Messages from "./Messages";
import { redirect } from "next/navigation";
import { ObjectId } from "bson";

export default async function MessagesWrapper({ chatId }: { chatId: string }) {
  if (!ObjectId.isValid(chatId)) redirect("/assistant");
  const messages = await getMessages(chatId);
  if (!messages) redirect("/assistant");
  
  return <Messages initialMessages={messages} />;
}
