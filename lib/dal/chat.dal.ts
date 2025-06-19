// All database interaction will happen in this file

import "server-only";

import { prisma } from "../db/prisma";
import cloudinary from "..";
import { v4 as uuidv4 } from "uuid";

export const startNewChatInDB = async (
  userId: string,
  userPrompt: string | null,
  imageBase64: string | null
) => {
  try {
    let publicUploadedImageId = "";
    if (imageBase64) {
      const newPublicId = `chat_images/${userId}-${uuidv4()}`;

      const res = await cloudinary.uploader.upload(imageBase64, {
        folder: "chat_images",
        public_id: newPublicId,
        overwrite: false,
      });

      publicUploadedImageId = res.public_id;
    }

    const chatSession = await prisma.chatSession.create({
      data: {
        userId,
        title: userPrompt
          ? userPrompt !== ""
            ? userPrompt?.slice(0, 50)
            : "Image Uploaded"
          : "Image Uploaded",
        messages: {
          create: {
            role: "user",
            content: userPrompt
              ? userPrompt !== ""
                ? userPrompt
                : "Image Uploaded"
              : "Image Uploaded",
            image: publicUploadedImageId ? publicUploadedImageId : undefined,
          },
        },
      },
      include: {
        messages: true,
      },
    });

    return chatSession;
  } catch (error) {
    console.log(error);
    return undefined;
  }
};

export const sendPrompt = async (chatId: string, userPrompt: string) => {
  const messages = await prisma.message.create({
    data: {
      chatId: chatId,
      role: "user",
      content: userPrompt,
    },
  });
  return messages;
};

export const getChatListOfUser = async (userId: string) => {
  const currentUser = await prisma.user.findUnique({
    where: {
      id: userId,
    },
    include: { chats: true },
  });

  return currentUser?.chats;
};

export const deleteChatFromDB = async (chatId: string) => {
  await prisma.$transaction([
    prisma.message.deleteMany({
      where: { chatId },
    }),
    prisma.chatSession.delete({
      where: { id: chatId },
    }),
  ]);
};

export const getMessagesUsingChatId = async (chatId: string) => {
  const messages = await prisma.message.findMany({
    where: {
      chatId,
    },
  });
  if (!messages || messages.length === 0) return null;
  return messages;
};
