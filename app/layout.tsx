import type { Metadata } from "next";
import { Geist, Geist_Mono, Roboto, Ubuntu } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "sonner";
import Navbar from "@/components/header/Navbar";
import { cookies } from "next/headers";
import { isUserAuthenticated } from "@/lib/session";
import Footer from "@/components/footer/Footer";
import LayoutWrapper from "@/components/LayoutWrapper";

const roboto = Roboto({
  variable: "--font-roboto",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});
const ubuntu = Ubuntu({
  variable: "--font-ubuntu",
  weight: ["400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Medical & Wellfare Companion",
  description: "Medical & Wellfare Companion",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const isAuthenticated = await isUserAuthenticated(
    cookieStore.get("session")?.value
  );
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${roboto.variable} ${ubuntu.variable} font-roboto antialiased bg-light-1 dark:bg-dark-4`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LayoutWrapper isAuthenticated={isAuthenticated}>
            {children}
          </LayoutWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
