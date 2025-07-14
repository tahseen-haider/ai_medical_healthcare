// All database interaction will happen in this file

import "server-only";

import { cache } from "react";
import { deleteSession, getUserIdnRoleIfAuthenticated } from "../session";
import { prisma } from "../db/prisma";
import {
  UserCredentialDTO,
  UserIDandRoleForSessionDTO,
} from "../dto/user.dto";
import bcrypt from "bcryptjs";
import cloudinary from "../cloudinary";
import { redirect } from "next/navigation";
import { UserType } from "../definitions";

export const getUserIdnRoleIfAuthenticatedAction = async () => {
  return await getUserIdnRoleIfAuthenticated();
};

export const getUser = async (
  userId: string | undefined
): Promise<UserType | undefined> => {
  if (!userId) return;
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        appointmentsAsDoctor: true,
        appointmentsAsPatient: true,
        doctorProfile: true,
      },
    });
    if (!user) return;

    const { password, token, ...restUser } = user || {};

    return restUser;
  } catch (error) {
    console.log(error);
    return;
  }
};

export const getUserByEmailPassword = cache(
  async (email: string, password: string) => {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        name: true,
        dob: true,
        email: true,
        phone: true,
        gender: true,
        role: true,
        password: true,
        pfp: true,
        id: true,
      },
    });
    if (!user) return;

    const correctPassword = await bcrypt.compare(password, user.password!);
    if (!correctPassword) return;

    return {
      name: user.name,
      dob: user.dob ? user.dob : undefined,
      email: user.email,
      phone: user.phone ? user.phone : undefined,
      gender: user.gender ? user.gender : undefined,
      role: user.role,
      pfp: user.pfp ? user.pfp : undefined,
      id: user.id,
    };
  }
);

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
        pfp: true,
      },
    });
    return user;
  }
);

export const insertUserToDB = async (
  name: string,
  email: string,
  hashedPassword: string
): Promise<number | null> => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) return null;
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        token: Math.floor(1000 + Math.random() * 900000),
      },
    });
    return user.token;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const verifyEmailTokenfromDB = async ({
  email,
  verifyToken,
}: {
  email: string;
  verifyToken: number;
}): Promise<UserIDandRoleForSessionDTO | undefined> => {
  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user || user.token != verifyToken) return undefined;

  await prisma.user.update({
    where: { email },
    data: {
      token: 0,
      is_verified: true,
    },
  });
  return { id: user.id, role: user.role };
};

export const isUserVerified = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  const is_verified = user?.is_verified;

  return is_verified;
};

export const verifyUserCredentials = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });
  if (!user) return;

  const isPasswordMatched = await bcrypt.compare(password, user.password!);

  if (!isPasswordMatched) return;

  return user;
};

export const verifyToken = async (email: string, code: number) => {
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (user?.token !== code) return;
  return user;
};

export const setUserToken = async ({
  code,
  email,
}: {
  code: number;
  email: string;
}) => {
  const user = await prisma.user.update({
    where: { email },
    data: {
      token: code,
    },
  });
};

export const resetPasswordInDB = async ({
  email,
  newPassword,
}: {
  email: string;
  newPassword: string;
}) => {
  const user = await prisma.user.findFirst({
    where: { email },
  });

  if (!user || !user.token) return;

  const updatedUser = await prisma.user.update({
    where: { email },
    data: {
      password: newPassword,
      token: null,
      is_verified: true,
    },
  });
  if (!updatedUser) return;

  return updatedUser.email;
};

export const deleteLoggedInUserFromDB = async () => {
  const user = await getUserIdnRoleIfAuthenticated();
  try {
    // Get all messages that have images
    const messagesWithImages = await prisma.message.findMany({
      where: {
        chat: {
          userId: user?.userId,
        },
        NOT: {
          image: null,
        },
      },
      select: {
        image: true,
      },
    });
    const imageUrls = messagesWithImages.map((m) => m.image).filter(Boolean);

    // Get profile Image and delete it
    const activeUser = await prisma.user.findFirst({
      where: {
        id: user?.userId,
      },
    });
    const profilePicture = activeUser?.pfp;
    if (profilePicture) await cloudinary.uploader.destroy(profilePicture);

    // Delete messages and chats
    await prisma.$transaction(async (tx) => {
      await tx.message.deleteMany({
        where: {
          chat: {
            userId: user?.userId,
          },
        },
      });

      await tx.chatSession.deleteMany({
        where: {
          userId: user?.userId,
        },
      });

      await tx.account.deleteMany({
        where: {
          userId: user?.userId,
        },
      });

      await tx.doctorProfile.deleteMany({
        where: {
          userId: user?.userId,
        },
      });

      await tx.appointments.deleteMany({
        where: {
          patientId: user?.userId,
        },
      });

      await tx.user.delete({
        where: {
          id: user?.userId,
        },
      });
    });

    for (const id of imageUrls) {
      await cloudinary.uploader.destroy(id!);
    }

    deleteSession();
    return 1;
  } catch (error) {
    console.log("Catching");
    return 0;
  } finally {
    redirect("/");
  }
};

export async function updateUserProfileInDB(userData: {
  id: string;
  name: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  pfp: string;
  bloodType: string;
  allergies: string[];
  chronicConditions: string[];
  medications: string[];
  surgeries: string[];
  immunizations: string[];
  bloodPressure: string;
  heartRate: number | null;
  respiratoryRate: number | null;
  temperature: number | null;
  height: number | null;
  weight: number | null;
  smoker: boolean | null;
  alcoholUse: boolean | null;
  exerciseFrequency: string;
  mentalHealthConcerns: string[];
  notes: string;
}) {
  const {
    id,
    name,
    email,
    phone,
    dob,
    gender,
    pfp,
    bloodType,
    allergies,
    chronicConditions,
    medications,
    surgeries,
    immunizations,
    bloodPressure,
    heartRate,
    respiratoryRate,
    temperature,
    height,
    weight,
    smoker,
    alcoholUse,
    exerciseFrequency,
    mentalHealthConcerns,
    notes,
  } = userData;

  const existingUser = await prisma.user.findUnique({
    where: { id },
    select: { pfp: true },
  });

  if (existingUser?.pfp && existingUser.pfp !== pfp) {
    await cloudinary.uploader.destroy(existingUser.pfp);
  }

  return await prisma.user.update({
    where: { id },
    data: {
      name,
      email,
      phone,
      dob,
      gender,
      pfp,
      bloodType,
      allergies,
      chronicConditions,
      medications,
      surgeries,
      immunizations,
      bloodPressure,
      heartRate,
      respiratoryRate,
      temperature,
      height,
      weight,
      smoker,
      alcoholUse,
      exerciseFrequency,
      mentalHealthConcerns,
      notes,
    },
  });
}

export async function setLoginDate(userId: string) {
  await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      lastLogin: new Date(Date.now()),
    },
  });
}
