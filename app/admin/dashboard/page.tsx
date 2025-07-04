import React, { Suspense } from "react";
import AdminDashboardNumbersInfo from "./components/AdminDashboardNumbersInfo";
import AdminDashboardGraph from "./components/AdminDashboardGraph";
import AdminDashboardRecentUsers from "./components/AdminDashboardRecentUsers";
import RecentMembersFallback from "./components/suspense/RecentUsersSuspense";
import AdminDashboardRecentInquiries from "./components/AdminDashboardRecentInquiries";
import RecentInquiriesFallback from "./components/suspense/DashboardInquirySuspense";
import AdminDashboardRecentAppointments from "./components/AdminDashboardRecentAppointments";

export default function DashboardPage() {
  return (
    <main className="w-full flex justify-center">
      <section className="flex flex-col gap-4 p-6 w-full max-w-[1920px]">
        {/* Heading */}
        <h1 className="font-bold font-ubuntu text-2xl ml-9">Dashboard</h1>
        {/* Graph Info */}
        <div className="w-full flex flex-col gap-4 lg:flex-row ">
          {/* Graph */}
          <div className="bg-white dark:bg-dark-4 rounded-sm w-full lg:w-2/3 h-80 shadow-dark dark:shadow-light">
            <AdminDashboardGraph />
          </div>
          {/* Info */}
          <div className="w-full flex flex-col gap-4 lg:w-1/3 h-80">
            <AdminDashboardNumbersInfo />
          </div>
        </div>

        {/* Recent Users */}
        <div className="w-full">
          <Suspense fallback={<RecentMembersFallback />}>
            <AdminDashboardRecentUsers />
          </Suspense>
        </div>

        <div className="w-full flex gap-4 flex-col md:flex-row">
          {/* Recent Inquiries */}
          <div className="w-full lg:w-1/2">
            <Suspense fallback={<RecentInquiriesFallback />}>
              <AdminDashboardRecentInquiries />
            </Suspense>
          </div>
          {/* Recent Appointments */}
          <div className="w-full lg:w-1/2">
            <Suspense fallback={<RecentInquiriesFallback />}>
              <AdminDashboardRecentAppointments/>
            </Suspense>
          </div>
        </div>
      </section>
    </main>
  );
}
