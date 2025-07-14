// All database interaction will happen in this file

import "server-only";

import { prisma } from "../db/prisma";
import cloudinary from "../cloudinary";
import { v4 as uuidv4 } from "uuid";
import { getMessages } from "@/actions/chat.action";

export const startNewChatInDB = async (
  userId: string,
  userPrompt: string | null,
  imageBase64: string | null
) => {
  try {
    const uploadPromise = imageBase64
      ? cloudinary.uploader.upload(imageBase64, {
          folder: "chat_images",
          public_id: `chat_images/${userId}-${uuidv4()}`,
          overwrite: false,
        })
      : null;

    const title = userPrompt?.trim()
      ? userPrompt.slice(0, 50)
      : "Image Uploaded";

    const content = userPrompt?.trim() ? userPrompt : "Image Uploaded";

    const res = uploadPromise ? await uploadPromise : null;
    const publicUploadedImageId = res?.public_id;

    const chatSession = await prisma.chatSession.create({
      data: {
        userId,
        title,
        messages: {
          create: {
            role: "user",
            content,
            image: publicUploadedImageId,
          },
        },
      },
    });

    return chatSession.id;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export const getChatListOfUser = async (userId: string) => {
  try {
    const currentUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: { chats: { orderBy: { updatedAt: "desc" } } },
    });

    return currentUser?.chats;
  } catch (error) {
    return;
  }
};

const getAllImgsOfChatId = async (chatId: string) => {
  try {
    const messages = await getMessages(chatId);
    return (
      messages
        ?.map((ele) => ele.image)
        .filter((img): img is string => typeof img === "string") || []
    );
  } catch (error) {
    console.log("Error while getting Images ids: ", error);
  }
};

export const deleteChatFromDB = async (chatId: string) => {
  try {
    const res = await getAllImgsOfChatId(chatId);

    if (res) {
      for (const id of res) {
        await cloudinary.uploader.destroy(id!);
      }
    }
    await prisma.$transaction([
      prisma.message.deleteMany({
        where: { chatId },
      }),
      prisma.chatSession.delete({
        where: { id: chatId },
      }),
    ]);
  } catch (error) {
    console.log("Error while Deleting Chat: ", error);
  }
};

export const getMessagesUsingChatId = async (chatId: string) => {
  try {
    const messages = await prisma.message.findMany({
      where: {
        chatId,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    if (!messages || messages.length === 0) return null;
    return messages;
  } catch (error) {
    console.log(error);
    return;
  }
};
