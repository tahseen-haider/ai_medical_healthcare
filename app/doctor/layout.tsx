import { cookies } from "next/headers";
import DashboardLinks from "../admin/dashboard/components/DashboardLinks";
import DashboardSidebarWrapper from "../assistant/components/DashboardSidebarWrapper";
import { isUserAuthenticated } from "@/lib/session";
import { getUser } from "@/lib/dal/user.dal";

export default async function DoctorLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const DoctorSidebarLinks = [
    {
      title: "Dashboard",
      link: "/doctor/dashboard",
    },
    {
      title: "Appointments",
      link: "/doctor/appointments",
    },
    {
      title: "Out of Date Appointments",
      link: "/doctor/out-of-date-appointments",
    },
    {
      title: "Cancelled Appointments",
      link: "/doctor/cancelled-appointments",
    },
    // {
    //   title: "Admin Inquiries",
    //   link: "/doctor/admin-inquiries",
    // },
  ];

  const cookieStore = await cookies();
  const session = await isUserAuthenticated(cookieStore.get("session")?.value);
  const user = await getUser(session?.userId);
  return (
    <>
      <section className="w-full h-[calc(100vh-64px)] min-h-52 flex">
        {/* Sidebar */}
        <DashboardSidebarWrapper>
          <DashboardLinks user={user} links={DoctorSidebarLinks} />
        </DashboardSidebarWrapper>
        {/* Chat */}
        <div className="flex-1 h-[calc(100vh-65px)] overflow-auto w-full ">
          {children}
        </div>
      </section>
    </>
  );
}
