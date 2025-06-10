// All database interaction will happen in this file

import "server-only";

import { prisma } from "../db/prisma";

export const startNewChatInDB = async (userId: string, userPrompt: string) => {
  try {
    const chatSession = await prisma.chatSession.create({
      data: {
        userId,
        title: userPrompt.slice(0, 50),
        messages: {
          create: {
            role: "user",
            content: userPrompt,
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

export const insertNewMessageInDB = async (
  userId: string,
  userPrompt: string
) => {};

export const getChatListOfUser = async (userId: string) => {
  
  const currentUser = await prisma.user.findUnique({
    where: {
      id: userId
    },
    include: {chats: true}
  })

  return currentUser?.chats
};
