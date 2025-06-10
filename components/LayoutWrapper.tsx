"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/header/Navbar";
import Footer from "@/components/footer/Footer";
import { Toaster } from "sonner";

interface LayoutWrapperProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
}

export default function LayoutWrapper({ children, isAuthenticated }: LayoutWrapperProps) {
  const pathname = usePathname();

  const hideFooterRoutes = /^\/assistant(\/.*)?$/; 

  const showFooter = !hideFooterRoutes.test(pathname);

  return (
    <>
      <Toaster richColors position="top-center" />
      <Navbar isAuthenticated={isAuthenticated} />
      <div className="h-16" />
      {children}
      {showFooter && <Footer />}
    </>
  );
}
