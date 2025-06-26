import { prisma } from "@/lib/db/prisma";
import { createSession } from "@/lib/session";
import { SignJWT } from "jose";
import { cookies } from "next/headers";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  if (!code) return new Response("Missing code", { status: 400 });

  // 1. Exchange code for token
  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: `${process.env.BASE_URL}/api/oauth/google/callback`,
      grant_type: "authorization_code",
    }),
  });

  const tokenData = await tokenRes.json();

  let isNew = false;

  // 2. Fetch user info
  const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
    },
  });

  const profile = await userInfoRes.json();

  // 3. Check for existing account
  const existingAccount = await prisma.account.findUnique({
    where: {
      provider_providerAccountId: {
        provider: "google",
        providerAccountId: profile.sub,
      },
    },
    include: { user: true },
  });

  let user;
  if (existingAccount) {
    user = existingAccount.user;
  } else {
    // 4. Check by email
    const existingUser = await prisma.user.findUnique({
      where: { email: profile.email },
    });

    if (existingUser) {
      await prisma.account.create({
        data: {
          userId: existingUser.id,
          provider: "google",
          providerAccountId: profile.sub,
        },
      });
      user = existingUser;
    } else {
      isNew = true;
      user = await prisma.user.create({
        data: {
          email: profile.email,
          name: profile.name,
          is_verified: true,
          role: "user",
          accounts: {
            create: {
              provider: "google",
              providerAccountId: profile.sub,
            },
          },
        },
      });
    }
  }

  // 5. Create JOSE token
  await createSession(user.id, user.role)

  if(isNew){
    return Response.redirect(`${process.env.BASE_URL}/settings`);
  }else{
    return Response.redirect(`${process.env.BASE_URL}`);
  }
}
