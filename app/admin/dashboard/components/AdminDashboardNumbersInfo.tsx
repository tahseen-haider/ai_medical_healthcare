import { Stethoscope, Users2 } from "lucide-react";
import React from "react";

export default function AdminDashboardNumbersInfo() {
  return (
    <>
      <div className="flex gap-4 h-1/2 w-full">
        <div className="flex items-center justify-between w-1/2 p-2 rounded-sm h-full bg-white dark:bg-dark-4 shadow-dark dark:shadow-light">
          <div className="h-full flex flex-col items-center justify-center gap-2 text-gray-700 dark:text-gray-300">
            <Users2 size={60} />
            <p>Users</p>
          </div>
          <div className="text-5xl font-ubuntu font-bold">200</div>
        </div>
        <div className="flex items-center justify-between w-1/2 p-2 rounded-sm h-full bg-white dark:bg-dark-4 shadow-dark dark:shadow-light">
          <div className="h-full flex flex-col items-center justify-center gap-2 text-gray-700 dark:text-gray-300">
            <Stethoscope size={60} />
            <p>Doctors</p>
          </div>
          <div className="text-5xl font-ubuntu font-bold">12</div>
        </div>
      </div>
      <div className="flex gap-4 h-1/2 w-full">
        <div className="flex items-center justify-between w-1/2 p-2 rounded-sm h-full bg-white dark:bg-dark-4 shadow-dark dark:shadow-light">
          <div className="h-full flex flex-col items-center justify-center gap-2 text-gray-700 dark:text-gray-300">
            <Users2 size={60} />
            <p>Users</p>
          </div>
          <div className="text-5xl font-ubuntu font-bold">200</div>
        </div>
        <div className="flex items-center justify-between w-1/2 p-2 rounded-sm h-full bg-white dark:bg-dark-4 shadow-dark dark:shadow-light">
          <div className="h-full flex flex-col items-center justify-center gap-2 text-gray-700 dark:text-gray-300">
            <Stethoscope size={60} />
            <p>Doctors</p>
          </div>
          <div className="text-5xl font-ubuntu font-bold">12</div>
        </div>
      </div>
    </>
  );
}
