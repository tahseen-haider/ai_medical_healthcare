import "server-only";

import { cookies } from "next/headers";
import { cache } from "react";
import { decrypt } from "./session";
import { redirect } from "next/navigation";
import { connectToDB } from "@/db";
import { User } from "@/db/models/userModel";

export const verifySession = cache(async () => {
  const cookie = (await cookies()).get("session")?.value;
  const session = await decrypt(cookie);

  if (!session?.userId) {
    redirect("/login");
  }

  return { isAuth: true, userId: session.userId };
});

export const getUser = cache(async () => {
  const session = await verifySession();
  if (!session) return null;

  try {
    await connectToDB();

    const user = await User.findById(session.userId).lean();
    return user;
  } catch (error) {
    console.log(error)
    return null
  }
});
