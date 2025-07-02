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
    take: 10,
    orderBy: {
      createdAt: 'desc'
    }
  })

  return users;
 }

export const getInquiriesFromDB = async () => { 
  return await prisma.inquiries.findMany({
    take: 10,
    orderBy: {
      createdAt: 'desc'
    }
  })
 }