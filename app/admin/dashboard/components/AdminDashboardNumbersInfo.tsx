import { getAdminDashboardNumbers } from "@/actions/admin.action";
import { Clock, MailWarning, Stethoscope, Users2 } from "lucide-react";
import React from "react";

export default async function AdminDashboardNumbersInfo() {
  const info = await getAdminDashboardNumbers();
  const verifiedUsers = info.verifiedUsers < 10 ? `0${info.verifiedUsers}` : info.verifiedUsers;
  const verifiedDoctors = info.verifiedDoctors < 10 ? `0${info.verifiedDoctors}` : info.verifiedDoctors;
  const unreadInquiries = info.unreadInquiries < 10 ? `0${info.unreadInquiries}` : info.unreadInquiries;
  const pendingAppointments = info.pendingAppointments < 10 ? `0${info.pendingAppointments}` : info.pendingAppointments;
  return (
    <>
      <div className="flex gap-4 h-1/2 w-full">
        <div className="flex items-center justify-between w-1/2 p-2 rounded-sm h-full bg-white dark:bg-dark-4 shadow-dark dark:shadow-light">
          <div className="h-full flex flex-col items-center justify-center gap-2 text-gray-700 dark:text-gray-300">
            <Users2 size={60} />
            <p>Users</p>
          </div>
          <div className="text-5xl font-ubuntu font-bold">{verifiedUsers}</div>
        </div>
        <div className="flex items-center justify-between w-1/2 p-2 rounded-sm h-full bg-white dark:bg-dark-4 shadow-dark dark:shadow-light">
          <div className="h-full flex flex-col items-center justify-center gap-2 text-gray-700 dark:text-gray-300">
            <Stethoscope size={60} />
            <p>Doctors</p>
          </div>
          <div className="text-5xl font-ubuntu font-bold">
            {verifiedDoctors}
          </div>
        </div>
      </div>
      <div className="flex gap-4 h-1/2 w-full">
        <div className="flex items-center justify-between w-1/2 p-2 rounded-sm h-full bg-white dark:bg-dark-4 shadow-dark dark:shadow-light">
          <div className="h-full text-left flex flex-col items-start justify-center gap-2 text-gray-700 dark:text-gray-300">
            <MailWarning size={60} />
            <p>Unread Inquiries</p>
          </div>
          <div className="text-5xl font-ubuntu font-bold">
            {unreadInquiries}
          </div>
        </div>
        <div className="flex items-center justify-between w-1/2 p-2 rounded-sm h-full bg-white dark:bg-dark-4 shadow-dark dark:shadow-light">
          <div className="h-full flex flex-col items-center justify-center gap-2 text-gray-700 dark:text-gray-300">
            <Clock size={60} />
            <p>Pending Appointments</p>
          </div>
          <div className="text-5xl font-ubuntu font-bold">
            {pendingAppointments}
          </div>
        </div>
      </div>
    </>
  );
}
