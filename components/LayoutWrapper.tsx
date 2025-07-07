"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/header/Navbar";
import Footer from "@/components/footer/Footer";
import { Toaster } from "sonner";

interface LayoutWrapperProps {
  children: React.ReactNode;
  role: string | undefined;
  imageUrl?: string;
}

export default function LayoutWrapper({
  children,
  role,
  imageUrl,
}: LayoutWrapperProps) {
  const pathname = usePathname();

  const hideFooterRoutes = /^\/(assistant(\/.*)?|admin(\/.*)?|doctor(\/.*)?)$/;

  const showFooter = !hideFooterRoutes.test(pathname);

  return (
    <>
      <Toaster richColors position="top-center" />
      <Navbar role={role} imageUrl={imageUrl} />
      <div className="h-16" />
      <div className="min-h-[60vh]">{children}</div>
      {showFooter && <Footer />}
    </>
  );
}
