import { getAllVerifiedUsers } from "@/actions/admin.action";
import Btn from "@/components/Button";
import ProfilePicture from "@/components/ProfilePicture";
import React from "react";
import DashManageUsersBtn from "./Btns/DashManageUsersBtn";



export default async function AdminDashboardRecentUsers() {

  const verifiedUsers = await getAllVerifiedUsers();

  const users = [
    {
      id: 1,
      avatar: "/avatar1.png",
      name: "Alice Johnson",
      role: "Admin",
      email: "alice@example.com",
      createdAt: "2025-06-28",
    },
    {
      id: 2,
      avatar: "/avatar2.png",
      name: "Bob Smith",
      role: "User",
      email: "bob@example.com",
      createdAt: "2025-06-21",
    },
    {
      id: 3,
      avatar: "/avatar3.png",
      name: "Charlie Lee",
      role: "Moderator",
      email: "charlie@example.com",
      createdAt: "2025-06-15",
    },
    {
      id: 3,
      avatar: "/avatar3.png",
      name: "Charlie Lee",
      role: "Moderator",
      email: "charlie@example.com",
      createdAt: "2025-06-15",
    },
    {
      id: 3,
      avatar: "/avatar3.png",
      name: "Charlie Lee",
      role: "Moderator",
      email: "charlie@example.com",
      createdAt: "2025-06-15",
    },
    {
      id: 3,
      avatar: "/avatar3.png",
      name: "Charlie Lee",
      role: "Moderator",
      email: "charlie@example.com",
      createdAt: "2025-06-15",
    },

    // Add more rows as needed
  ];
  return (
    <div className="w-full py-4 bg-white dark:bg-dark-4 shadow-dark dark:shadow-light rounded-md p-3">
      {/* Heading */}
      <h2 className="font-bold font-ubuntu pb-2">Recent Members:</h2>
      {/* Table */}
      <div className="max-h-[210px] overflow-y-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-50 dark:bg-gray-950 sticky top-0 z-10">
            <tr>
              <th className="font-semibold p-2 py-3 pr-4">#</th>
              <th className="font-semibold">Avatar</th>
              <th className="font-semibold">Name</th>
              <th className="font-semibold">Role</th>
              <th className="font-semibold">Email</th>
              <th className="font-semibold">Created At</th>
            </tr>
          </thead>
          <tbody className="divide-y gap-4">
            {verifiedUsers.map((user, index) => (
              <tr
                key={index}
                className="hover:bg-gray-200 hover:dark:bg-gray-950 p-2"
              >
                <td className="p-2 py-4">{index + 1}</td>
                <td className="">
                  <ProfilePicture size={30} />
                </td>
                <td className="">{user.name}</td>
                <td className="">{user.role}</td>
                <td className="">{user.email}</td>
                <td className="">{user.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Table */}
      <div className="w-fit mx-auto mt-4">
        <DashManageUsersBtn/>
      </div>
    </div>
  );
}
