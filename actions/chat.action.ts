"use server";

import {
  deleteChatFromDB,
  getChatListOfUser,
  getMessagesUsingChatId,
  startNewChatInDB,
} from "@/lib/dal/chat.dal";
import {
  ChatInputSchema,
  ChatState,
  DeleteChatSchema,
  NewChatInputSchema,
} from "@/lib/definitions";
import { getAuthenticateUserIdnRole } from "@/lib/session";
import { redirect } from "next/navigation";

export async function startNewChat(state: ChatState, formData: FormData) {
  const validatedFields = NewChatInputSchema.safeParse({
    userPrompt: formData.get("userPrompt"),
  });

  if (!validatedFields.success) return { message: "Invalid Input" };

  const { userPrompt } = validatedFields.data;
  const imageBase64 = formData.get("imageBase64") as string | null

  const authenticateUser = await getAuthenticateUserIdnRole();
  const newChatSession = await startNewChatInDB(
    authenticateUser.userId,
    userPrompt,
    imageBase64
  );

  return redirect(`/assistant/${newChatSession?.id}`);
}

export async function getChatList() {
  const user = await getAuthenticateUserIdnRole();
  const chatList = await getChatListOfUser(user.userId);

  if(chatList?.length===0) return []
  return chatList;
}

export async function getMessages(chatId: string) {
  const res = await getMessagesUsingChatId(chatId);
  if(!res) { console.log("first"); return null};
  return res;
}

export async function deleteChat(state: ChatState, formData: FormData) {
  const validatedFields = DeleteChatSchema.safeParse({
    chatId: formData.get("chatId"),
  });

  if (!validatedFields.success) return { message: "Something went wrong" };

  const { chatId } = validatedFields.data;

  await deleteChatFromDB(chatId);

  redirect("/assistant");
}
