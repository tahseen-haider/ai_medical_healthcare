// All database interaction will happen in this file

import "server-only";

import { cache } from "react";
import { getAuthenticateUser } from "../session";
import { prisma } from "../db/prisma";
import { UserCredentialDTO, UserIDandRoleForSessionDTO, UserProfileDTO } from "../dto/user.dto";

export const getUser = cache(async (): Promise<UserProfileDTO | null> => {
  const session = await getAuthenticateUser();
  if (!session) return null;

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        name: true,
        dob: true,
        email: true,
        phone: true,
        gender: true,
        role: true,
      },
    });
    return user;
  } catch (error) {
    console.log(error);
    return null;
  }
});

export const getUserCredentialsByEmail = cache(
  async (email: string): Promise<UserCredentialDTO | null> => {
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        password: true,
        role: true,
      },
    });
    return user;
  }
);

export const insertUserToDB = async (
  name: string,
  email: string,
  hashedPassword: string
): Promise<UserIDandRoleForSessionDTO | undefined> => {
  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
    return {id: user.id, role: user.role}
  } catch (error) {
    console.log(error);
  }
};
