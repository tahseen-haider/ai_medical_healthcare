import DashboardLinks from "../admin/dashboard/components/DashboardLinks";
import DashboardSidebarWrapper from "../assistant/components/DashboardSidebarWrapper";

export default function DoctorLayout({
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
    // {
    //   title: "Admin Inquiries",
    //   link: "/doctor/admin-inquiries",
    // },
  ];

  return (
    <>
      <section className="w-full h-[calc(100vh-64px)] min-h-52 flex">
        {/* Sidebar */}
        <DashboardSidebarWrapper>
          <DashboardLinks links={DoctorSidebarLinks} />
        </DashboardSidebarWrapper>
        {/* Chat */}
        <div className="flex-1 h-[calc(100vh-65px)] overflow-auto w-full ">
          {children}
        </div>
      </section>
    </>
  );
}
