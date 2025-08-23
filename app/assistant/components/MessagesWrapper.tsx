import { getMessages } from "@/actions/chat.action";
import React from "react";
import Messages from "./Messages";
import { redirect } from "next/navigation";
import { ObjectId } from "bson";
import { getPfp } from "@/actions";
import { getUser } from "@/lib/dal/user.dal";
import { getUserIdnRoleIfAuthenticated } from "@/lib/dal/session.dal";

export default async function MessagesWrapper({ chatId }: { chatId: string }) {
  if (!ObjectId.isValid(chatId)) redirect("/assistant");
  const messages = await getMessages(chatId);
  if (!messages) redirect("/assistant");

  const pfpUrl = await getPfp();
  const user = await getUserIdnRoleIfAuthenticated();
  if (!user?.userId) redirect("/");
  const userData = await getUser(user?.userId);

  return <Messages userData={userData!} initialMessages={messages} pfpUrl={pfpUrl} />;
}
