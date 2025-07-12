import { prisma } from "@/lib/db/prisma";
import { createSession } from "@/lib/session";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  if (!code) return new Response("Missing code", { status: 400 });

  try {
    // 1. Exchange code for access token
    const tokenRes = await fetch(
      "https://github.com/login/oauth/access_token",
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: process.env.GITHUB_CLIENT_ID!,
          client_secret: process.env.GITHUB_CLIENT_SECRET!,
          code,
        }),
      }
    );

    const tokenData = await tokenRes.json();

    // 2. Fetch GitHub user info
    const userInfoRes = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: "application/json",
      },
    });
    const profile = await userInfoRes.json();

    // 3. Get primary email (GitHub may not return it with user info)
    const emailRes = await fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: "application/json",
      },
    });

    const emails = await emailRes.json();
    const primaryEmail =
      emails.find((e: any) => e.primary && e.verified)?.email ||
      emails[0]?.email;

    if (!primaryEmail) {
      return new Response("Email not available", { status: 400 });
    }

    let isNew = false;
    // 4. Check for existing account
    const existingAccount = await prisma.account.findUnique({
      where: {
        provider_providerAccountId: {
          provider: "github",
          providerAccountId: profile.id.toString(),
        },
      },
      include: { user: true },
    });

    let user;
    if (existingAccount) {
      user = existingAccount.user;
    } else {
      const existingUser = await prisma.user.findUnique({
        where: { email: primaryEmail },
      });

      if (existingUser) {
        await prisma.account.create({
          data: {
            userId: existingUser.id,
            provider: "github",
            providerAccountId: profile.id.toString(),
          },
        });
        user = existingUser;
      } else {
        isNew = true;
        user = await prisma.user.create({
          data: {
            email: primaryEmail,
            name: profile.name ?? profile.login,
            is_verified: true,
            role: "user",
            accounts: {
              create: {
                provider: "github",
                providerAccountId: profile.id.toString(),
              },
            },
          },
        });
      }
    }

    // 5. Sign JOSE token
    await createSession(user.id, user.role);

    if (isNew) {
      return Response.redirect(`${process.env.BASE_URL}/settings`);
    } else {
      return Response.redirect(`${process.env.BASE_URL}`);
    }
  } catch (error) {
    console.log(error);
    return;
  }
}
