import { NextResponse } from "next/server";

export async function GET() {
  const redirectUri = encodeURIComponent(`${process.env.BASE_URL}/api/oauth/google/callback`);
  const clientId = process.env.GOOGLE_CLIENT_ID!;
  const scope = encodeURIComponent("openid email profile");

  const url = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;

  return NextResponse.redirect(url);
}
