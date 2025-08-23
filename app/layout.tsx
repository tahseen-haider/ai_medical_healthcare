import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { cookies } from "next/headers";
import { isUserAuthenticated } from "@/lib/dal/session.dal";
import LayoutWrapper from "@/components/LayoutWrapper";
import { getUser } from "@/lib/dal/user.dal";
import { ubuntu, roboto } from "@/lib/fonts"


export const metadata: Metadata = {
  title: "Medical & Wellfare Companion",
  description:
    "Medical and Wellfare Companion Ai assistant for your medical queries.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const session = await isUserAuthenticated(cookieStore.get("session")?.value);
  const user = await getUser(session?.userId);
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${roboto.variable} ${ubuntu.variable} font-roboto antialiased bg-gray-50 dark:bg-gray-950`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange={true}
        >
          <LayoutWrapper user={user}>
            {children}
          </LayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
