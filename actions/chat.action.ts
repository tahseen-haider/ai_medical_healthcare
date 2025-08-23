"use server";

import cloudinary from "@/lib/cloudinary";
import {
  deleteChatFromDB,
  getChatListOfUser,
  getMessagesUsingChatId,
  startNewChatInDB,
} from "@/lib/dal/chat.dal";
import {
  ChatState,
  DeleteChatSchema,
  NewChatInputSchema,
} from "@/lib/definitions";
import { getAuthenticateUserIdnRole } from "@/lib/dal/session.dal";
import { redirect } from "next/navigation";

export async function startNewChat(state: ChatState, formData: FormData) {
  const validatedFields = NewChatInputSchema.safeParse({
    userPrompt: formData.get("userPrompt"),
  });

  if (!validatedFields.success) return { message: "Invalid Input" };

  const { userPrompt } = validatedFields.data;
  const imageBase64 = formData.get("imageBase64") as string | null;
  const userId = formData.get("userId") as string;

  const newChatSessionId = await startNewChatInDB(
    userId,
    userPrompt,
    imageBase64
  );

  return redirect(`/assistant/${newChatSessionId}`);
}

export async function getChatList() {
  const user = await getAuthenticateUserIdnRole();
  const chatList = await getChatListOfUser(user.userId);

  if (chatList?.length === 0) return [];
  return chatList;
}

export async function getMessages(chatId: string) {
  const res = await getMessagesUsingChatId(chatId);
  if (!res) {
    return null;
  }
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

export const uploadChatImageToCloudinary = async (
  base64: string,
  publicId: string
) => {
  const res = await cloudinary.uploader.upload(base64, {
    folder: "chat_images",
    public_id: publicId,
    overwrite: false,
  });
  return res.public_id;
};

export async function deleteImageFromCloudinary(state: {}, formData: FormData) {
  const publicId = formData.get("public_image_id") as string;
  if (!publicId) return {};
  try {
    const res = await cloudinary.uploader.destroy(publicId);
    return {};
  } catch (err) {
    console.error("Cloudinary Deletion Error:", err);
    return {};
  }
}
