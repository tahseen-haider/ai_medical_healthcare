// import "server-only";
// import { SignJWT, jwtVerify } from "jose";
// import { cookies } from "next/headers";
// import { SessionPayload } from "./definitions";
// import { cache } from "react";
// import { redirect } from "next/navigation";
// import { User } from "@/lib/db/models/userModel";

// const secretKey = process.env.SESSION_SECRET;
// const encodedKey = new TextEncoder().encode(secretKey);

// export async function encrypt(payload: SessionPayload) {
//   return new SignJWT(payload)
//     .setProtectedHeader({ alg: "HS256" })
//     .setIssuedAt(Date.now())
//     .setExpirationTime("7d")
//     .sign(encodedKey);
// }

// export async function decrypt(session: string | undefined = "") {
//   try {
//     const { payload } = await jwtVerify(session, encodedKey, {
//       algorithms: ["HS256"],
//     });
//     return payload;
//   } catch (error) {
//     console.log(error);
//   }
// }

// export async function createSession(userId: string, role: "admin" | "user") {
//   const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
//   const session = await encrypt({ userId, role, expiresAt });
//   const cookieStore = await cookies();

//   cookieStore.set("session", session, {
//     httpOnly: true,
//     secure: process.env.NODE_ENV === "production",
//     expires: expiresAt,
//     sameSite: "lax",
//     path: "/",
//   });
// }

// export async function updateSession() {
//   const session = (await cookies()).get("session")?.value;
//   const payload = await decrypt(session);

//   if (!session || !payload) return null;

//   const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

//   const cookieStore = await cookies();
//   cookieStore.set("session", session, {
//     httpOnly: true,
//     secure: true,
//     expires: expires,
//     sameSite: "lax",
//     path: "/",
//   });
// }

// export const getAuthenticateUser = cache(async () => {
//   try {
//     const cookieStore = await cookies();
//     const sessionToken = cookieStore.get("session")?.value;
//     if (!sessionToken) redirect("/login");

//     const session = await decrypt(sessionToken);

//     if (!session?.userId) {
//       redirect("/login");
//     }

//     const user = await User.findOne({ _id: session.userId });
//     if (user) {
//       return { isAuth: true, userId: session.userId };
//     } else {
//       cookieStore.delete("session");
//       redirect("/login");
//     }
//   } catch {
//     redirect("/login")
//   }
// });

// export async function deleteSession() {
//   (await cookies()).delete("session");
// }
