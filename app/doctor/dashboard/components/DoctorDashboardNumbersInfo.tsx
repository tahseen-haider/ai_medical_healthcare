import { getAdminDashboardNumbers } from "@/actions/admin.action";
import { getDoctorDashboardNumbers } from "@/actions/doctor.action";
import { getUserIdnRoleIfAuthenticated } from "@/lib/session";
import {
  AlarmClock,
  AlarmClockCheck,
  Ban,
  CircleCheckBig,
  ClockFading,
} from "lucide-react";
import React from "react";

export default async function DoctorDashboardNumbersInfo({
  userId,
}: {
  userId: string;
}) {
  const info = await getDoctorDashboardNumbers(userId!);
  const pending = info.pending < 10 ? `0${info.pending}` : info.pending;
  const confirmed = info.confirmed < 10 ? `0${info.confirmed}` : info.confirmed;
  const completed = info.completed < 10 ? `0${info.completed}` : info.completed;
  const cancelled = info.cancelled < 10 ? `0${info.cancelled}` : info.cancelled;
  return (
    <>
      <div className="flex gap-4 h-1/2 w-full">
        <div className="flex items-center justify-between w-1/2 p-2 rounded-sm h-full bg-white dark:bg-dark-4 shadow-light dark:shadow-dark">
          <div className="h-full text-[14px] font-bold flex flex-col items-start justify-between max-h-24 gap-2 text-gray-600 dark:text-gray-300">
            <AlarmClock size={40} />
            <p>
              PENDING <br />
              Appointments
            </p>
          </div>
          <div className="text-5xl font-ubuntu font-bold">{pending}</div>
        </div>
        <div className="flex items-center justify-between w-1/2 p-2 rounded-sm h-full bg-white dark:bg-dark-4 shadow-light dark:shadow-dark">
          <div className="h-full text-[14px] font-bold flex flex-col items-start justify-between max-h-24 gap-2 text-gray-600 dark:text-gray-300">
            <AlarmClockCheck size={40} />
            <p>
              CONFIRMED <br />
              Appointments
            </p>
          </div>
          <div className="text-5xl font-ubuntu font-bold">{confirmed}</div>
        </div>
      </div>
      <div className="flex gap-4 h-1/2 w-full">
        <div className="flex items-center justify-between w-1/2 p-2 rounded-sm h-full bg-white dark:bg-dark-4 shadow-light dark:shadow-dark">
          <div className="h-full text-[14px] font-bold text-left flex flex-col  justify-between max-h-24 items-start gap-2 text-gray-600 dark:text-gray-300">
            <CircleCheckBig size={40} />
            <p>
              COMPLETED <br />
              Appointments
            </p>
          </div>
          <div className="text-5xl font-ubuntu font-bold">{completed}</div>
        </div>
        <div className="flex items-center justify-between w-1/2 p-2 rounded-sm h-full bg-white dark:bg-dark-4 shadow-light dark:shadow-dark">
          <div className="h-full text-[14px] font-bold flex flex-col items-start justify-between max-h-24 gap-2 text-gray-600 dark:text-gray-300">
            <Ban size={40} />
            <p>
              CANCELLED <br />
              Appointments
            </p>
          </div>
          <div className="text-5xl font-ubuntu font-bold">{cancelled}</div>
        </div>
      </div>
    </>
  );
}
