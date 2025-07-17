import { cookies } from "next/headers";
import DashboardSidebarWrapper from "../assistant/components/DashboardSidebarWrapper";
import DashboardLinks from "./dashboard/components/DashboardLinks";
import { isUserAuthenticated } from "@/lib/session";
import { getUser } from "@/lib/dal/user.dal";

export default async function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const AdminSidebarLinks = [
    {
      title: "Dashboard",
      link: "/admin/dashboard",
    },
    {
      title: "User Management",
      link: "/admin/user-management",
    },
    {
      title: "Appointments",
      link: "/admin/appointments",
    },
    {
      title: "Doctors",
      link: "/admin/doctors",
    },
    {
      title: "Inquiries",
      link: "/admin/inquiries",
    },
  ];

  const cookieStore = await cookies();
    const session = await isUserAuthenticated(cookieStore.get("session")?.value);
    const user = await getUser(session?.userId);

  return (
    <>
      <section className="w-full h-[calc(100vh-64px)] min-h-52 flex">
        {/* Sidebar */}
        <DashboardSidebarWrapper>
          <DashboardLinks user={user} links={AdminSidebarLinks} />
        </DashboardSidebarWrapper>
        {/* Chat */}
        <div className="flex-1 h-[calc(100vh-65px)] overflow-auto w-full ">
          {children}
        </div>
      </section>
    </>
  );
}
