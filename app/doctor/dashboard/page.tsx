import RecentInquiriesFallback from "@/app/admin/dashboard/components/suspense/DashboardInquirySuspense";
import React, { Suspense } from "react";
import DoctorDashboardGraph from "./components/DoctorDashboardGraph";
import DoctorDashboardNumbersInfo from "./components/DoctorDashboardNumbersInfo";
import { getUserIdnRoleIfAuthenticated } from "@/lib/dal/session.dal";
import DoctorDashboardRecentAppointments from "./components/DoctorDashboardRecentAppointments";

export default async function DashboardPage() {
    const user = await getUserIdnRoleIfAuthenticated();
    const userId = user?.userId

  return (
    <main className="w-full flex justify-center">
      <section className="flex flex-col gap-4 p-6 w-full max-w-[1920px]">
        {/* Heading */}
        <h1 className="font-bold font-ubuntu text-2xl ml-9">Dashboard</h1>
        {/* Graph Info */}
        <div className="w-full flex flex-col gap-4 lg:flex-row ">
          {/* Graph */}
          <div className="bg-white dark:bg-dark-4 rounded-sm w-full lg:w-2/3 h-80 shadow-light dark:shadow-dark">
            <DoctorDashboardGraph />
          </div>
          {/* Info */}
          <div className="w-full flex flex-col gap-4 lg:w-1/3 h-80">
            <DoctorDashboardNumbersInfo userId={userId!}/>
          </div>
        </div>

        {/* Recent Users */}
        <div className="w-full">
          <Suspense fallback={<RecentInquiriesFallback />}>
            <DoctorDashboardRecentAppointments userId={userId!}/>
          </Suspense>
        </div>

        <div className="w-full">
          <Suspense fallback={<RecentInquiriesFallback />}>
            {/* <AdminDashboardRecentInquiries /> */}
          </Suspense>
        </div>
      </section>
    </main>
  );
}
