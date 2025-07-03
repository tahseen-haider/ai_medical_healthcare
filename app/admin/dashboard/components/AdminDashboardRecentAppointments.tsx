import React from "react";
import DashManageAppointmentsBtn from "./Btns/DashManageAppointmentsBtn";

export default function AdminDashboardRecentAppointments() {
  return (
    <div className="w-full py-4 bg-white dark:bg-dark-4 shadow-dark dark:shadow-light rounded-md">
      {/* Heading */}
      <h2 className="font-bold font-ubuntu pb-2 pl-2">Recent Messages:</h2>
      {/* Table */}
      <div className="max-h-[210px] overflow-y-auto">
        {inquiries.map((inquiry, index) => (
          <div
            key={index}
            className="w-full border-b-[1px] flex gap-2 justify-between hover:bg-gray-200 hover:dark:bg-gray-950 p-2"
          >
            <div className="flex gap-4 w-full">
              <div className="text-lg font-bold">{index + 1}</div>
              <div>
                <div className="flex gap-2 items-center">
                  <div className="text-lg font-bold">{inquiry.name}</div>
                  <p className="text-gray-700 dark:text-gray-400">
                    @{inquiry.email}
                  </p>
                </div>
                <div>{inquiry.message}</div>
              </div>
            </div>
            {inquiry.is_read ? (
              <div className="px-2 py-1 text-sm font-semibold text-green-700 bg-green-100 h-fit rounded-md">
                Read
              </div>
            ) : (
              <div className=" px-2 py-1 text-sm font-semibold text-red-700 bg-red-100 h-fit rounded-md">
                Unread
              </div>
            )}
          </div>
        ))}
      </div>
      {/* Button */}
      <div className="w-fit mx-auto mt-4">{<DashManageAppointmentsBtn />}</div>
    </div>
  );
}
