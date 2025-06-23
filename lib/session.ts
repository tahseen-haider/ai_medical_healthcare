import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { SessionPayload } from "./definitions";
import { cache } from "react";
import { redirect } from "next/navigation";
import { prisma } from "./db/prisma";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt(Date.now())
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = "") {
  if (typeof session !== "string" || !session) return;
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    });
    const res = payload as { userId: string; role: string };
    return res
  } catch (error) {
    console.error("JWT verification failed:", error);
    return null;
  }
}

export async function createSession(userId: string, role: "admin" | "user") {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  const session = await encrypt({ userId, role, expiresAt });
  const cookieStore = await cookies();

  cookieStore.set("session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function updateSession() {
  const session = (await cookies()).get("session")?.value;
  const payload = await decrypt(session);

  if (!session || !payload) return null;

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const cookieStore = await cookies();
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expires,
    sameSite: "lax",
    path: "/",
  });
}

export const getUserIdnRoleIfAuthenticated = async () => {
  
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;
  if (!sessionToken) return;

  const session = await decrypt(sessionToken);

  if (!session?.userId) {
    return;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.userId,
    },
  });
  if (user) {
    return { role: session.role, userId: session.userId };
  } else {
    cookieStore.delete("session");
    return;
  }
}

export const getAuthenticateUserIdnRole = cache(async () => {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session")?.value;
    if (!sessionToken) redirect("/login");

    const session = await decrypt(sessionToken);

    if (!session?.userId) {
      redirect("/login");
    }

    const user = await prisma.user.findUnique({
      where: {
        id: session.userId,
      },
    });
    if (user) {
      return { role: session.role, userId: session.userId };
    } else {
      cookieStore.delete("session");
      redirect("/login");
    }
  } catch {
    redirect("/login");
  }
});

export async function deleteSession() {
  (await cookies()).delete("session");
}

export const isUserAuthenticated = async (sessionToken: any) => {
  const session = await decrypt(sessionToken);
  return Boolean(session?.userId);
};
