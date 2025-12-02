"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/header/Navbar";
import Footer from "@/components/footer/Footer";
import { Toaster } from "sonner";
import { UserType } from "@/lib/definitions";
import ConnectionStatus from "./ConnectionStatus";

interface LayoutWrapperProps {
  user: UserType | undefined;
  children: React.ReactNode;
}

export default function LayoutWrapper({ user, children }: LayoutWrapperProps) {
  const pathname = usePathname();

  const hideFooterRoutes =
    /^\/(assistant(\/.*)?|admin(\/.*)?|doctor(\/.*)?|profile|settings)$/;

  const showFooter = !hideFooterRoutes.test(pathname);
  const isHomePage = pathname === "/";
  return (
    <main className="min-w-[240px]">
      <Toaster richColors position="top-center" />
      <ConnectionStatus />
      <Navbar user={user} />
      {!isHomePage && <div className="h-16" />}
      <div className="min-h-[60vh]">{children}</div>
      {showFooter && <Footer />}
    </main>
  );
}
