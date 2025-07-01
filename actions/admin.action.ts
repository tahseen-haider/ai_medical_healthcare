"use server";

import { getAllVerifiedUsersFromDB } from "@/lib/dal/admin.dal";
import { GetAllVerifiedUsersDTO } from "@/lib/dto/admin.dto";

export const getAllVerifiedUsers = async (): Promise<GetAllVerifiedUsersDTO> => {
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

    return usersToReturn;
  };
