import Image from "next/image";
import React from "react";

export default function AdminDashboardRecentUsers() {
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
    // Add more rows as needed
  ];
  return (
    <div className="w-full py-4">
      <h2>Recent Members:</h2>
      <table className="min-w-full text-sm text-left">
        <thead className="bg-gray-100 sticky top-0 z-10">
          <tr>
            <th className="px-4 py-2 font-semibold">#</th>
            <th className="px-4 py-2 font-semibold">Avatar</th>
            <th className="px-4 py-2 font-semibold">Name</th>
            <th className="px-4 py-2 font-semibold">Role</th>
            <th className="px-4 py-2 font-semibold">Email</th>
            <th className="px-4 py-2 font-semibold">Created At</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {users.map((user, index) => (
            <tr key={user.id} className="hover:bg-gray-50">
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2">
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              </td>
              <td className="px-4 py-2">{user.name}</td>
              <td className="px-4 py-2">{user.role}</td>
              <td className="px-4 py-2">{user.email}</td>
              <td className="px-4 py-2">{user.createdAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
