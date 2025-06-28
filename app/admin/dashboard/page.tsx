import React from "react";
import AdminDashboardNumbersInfo from "../components/AdminDashboardNumbersInfo";
import AdminDashboardGraph from "../components/AdminDashboardGraph";
import AdminDashboardRecentUsers from "../components/AdminDashboardRecentUsers";

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
          <AdminDashboardRecentUsers/>
        </div>
      </section>
    </main>
  );
}
