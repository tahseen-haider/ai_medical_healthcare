import DashboardSidebarWrapper from "../assistant/components/DashboardSidebarWrapper";
import DashboardLinks from "./components/DashboardLinks";

export default function AdminLayout({
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

  return (
    <>
      <section className="w-full h-[calc(100vh-64px)] min-h-52 flex">
        {/* Sidebar */}
        <DashboardSidebarWrapper>
          <DashboardLinks adminLinks={AdminSidebarLinks} />
        </DashboardSidebarWrapper>
        {/* Chat */}
        <div className="flex-1 h-[calc(100vh-65px)] overflow-auto w-full ">
          {children}
        </div>
      </section>
    </>
  );
}
