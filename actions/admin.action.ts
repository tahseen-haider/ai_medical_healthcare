"use server";

import {
  getAllVerifiedUsersFromDB,
  getInquiriesFromDB,
} from "@/lib/dal/admin.dal";
import { GetAllVerifiedUsersDTO, GetInquiriesDTO } from "@/lib/dto/admin.dto";

export const delayInMs = async (time: number) => {
  return new Promise((resolve) => setTimeout(resolve, time));
};

export const getAllVerifiedUsers =
  async (): Promise<GetAllVerifiedUsersDTO> => {
    const users = await getAllVerifiedUsersFromDB();

    const usersToReturn = users.map((user) => {
      return {
        pfp: user.pfp,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt.toLocaleDateString().split("T")[0],
      };
    });

    await delayInMs(2000);

    return usersToReturn;
  };

export const getInquiries = async (): Promise<GetInquiriesDTO> => {
  const inquiries = await getInquiriesFromDB();

  // await delayInMs(2000);

  return inquiries.map((inquiry) => {
    return {
      name: inquiry.fullname,
      email: inquiry.email,
      message: inquiry.inquiry,
      is_read: inquiry.is_read,
    };
  });
};
