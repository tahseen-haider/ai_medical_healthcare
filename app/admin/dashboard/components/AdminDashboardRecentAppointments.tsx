import React from "react";
import DashManageAppointmentsBtn from "./Btns/DashManageAppointmentsBtn";
import { getAppointments } from "@/actions/admin.action";

export default async function AdminDashboardRecentAppointments() {
  const allAppoitments = await getAppointments();
  return (
    <div className="w-full py-4 bg-white dark:bg-dark-4 shadow-dark dark:shadow-light rounded-md">
      {/* Heading */}
      <h2 className="font-bold font-ubuntu pb-2 pl-2">Recent Appointments:</h2>
      {/* Table */}
      <div className="max-h-[210px] h-[210px] overflow-y-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="border-b-2 font-semibold sticky top-0 z-10 bg-white dark:bg-dark-4">
            <tr>
              <th className="p-2 py-3 pr-4">#</th>
              <th className="px-3">Patient</th>
              <th className="px-3">Doctor</th>
              <th className="px-3">Reason For Visit</th>
              <th className="px-3">Date of Visit</th>
              <th className="px-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y gap-4">
            {allAppoitments.map((app, index) => (
              <tr
                key={index}
                className="hover:bg-gray-200 hover:dark:bg-gray-950 p-2"
              >
                <td className="p-2 py-4 font-bold">{index + 1}</td>
                <td className="px-3">{app.patientName}</td>
                <td className="px-3">{app.doctorName}</td>
                <td className="px-3">{app.reasonForVisit}</td>
                <td className="px-3">{app.dateForVisit.toLocaleDateString("en-GB")}</td>
                <td className="px-3">{app.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Button */}
      <div className="w-fit mx-auto mt-4">{<DashManageAppointmentsBtn />}</div>
    </div>
  );
}
