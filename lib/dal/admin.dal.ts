import "server-only"

import { prisma } from "../db/prisma"

export const getAllVerifiedUsersFromDB = async() => { 
  const users = await prisma.user.findMany({
    where: {
      is_verified:true
    },
    select:{
      pfp:true,
      name:true,
      email:true,
      createdAt:true,
      role:true
    },
    orderBy: {
      createdAt: 'desc'
    }
  })

  return users;
 }