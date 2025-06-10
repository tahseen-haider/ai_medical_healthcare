"use server";

import { getChatListOfUser, startNewChatInDB } from "@/lib/dal/chat.dal";
import { ChatInputSchema, ChatState } from "@/lib/definitions";
import { getAuthenticateUser } from "@/lib/session";
import { redirect } from "next/navigation";

export async function startNewChat(
  state: ChatState,
  formData: FormData
) {
  const validatedFields = ChatInputSchema.safeParse({
    userPrompt: formData.get("userPrompt"),
  });

  if (!validatedFields.success) return { message: "Invalid Input" };

  const { userPrompt } = validatedFields.data;

  const authenticateUser = await getAuthenticateUser();
  const newChatSession = await startNewChatInDB(
    authenticateUser.userId,
    userPrompt
  );

  return redirect(`/assistant/${newChatSession?.id}`);
}

export async function insertNewMessage (state: ChatState, formData: FormData){return {message: ""}}

export async function getChatList(){
  const user = await getAuthenticateUser()
  const chatList = await getChatListOfUser(user.userId)

  return chatList
}