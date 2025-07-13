import { getAllUsers } from "@/actions/admin.action";
import React from "react";
import DeleteUserBtn from "./Btns/DeleteUserBtn";
import ProfilePicture from "@/components/ProfilePicture";
import EditRoleOfUser from "./EditRoleOfUser";
import EditVerification from "./EditVerification";
import AddNewUserBtn from "./Btns/AddNewUserBtn";

export default async function UsersList({ paramPage }: { paramPage?: string }) {
  const page = parseInt(paramPage || "1", 10);
  const limit = 10;

  const { users, totalPages } = await getAllUsers(page, limit);

  return (
    <div className="w-full py-4 bg-white dark:bg-dark-4 shadow-dark dark:shadow-light rounded-md p-3 min-h-[calc(100vh-170px)] flex flex-col justify-between">
      <div className="flex-1 flex flex-col">
        <div className="w-full flex justify-between">
          <h2 className="font-bold font-ubuntu pb-2">All Users:</h2>
          <AddNewUserBtn />
        </div>

        <div className="overflow-x-auto flex-1">
          <table className="min-w-full text-sm text-left">
            <thead className="border-b-2 bg-white dark:bg-dark-4 sticky top-0 z-10">
              <tr>
                <th className="font-semibold p-2 py-3 pr-4">#</th>
                <th className="font-semibold px-3">Avatar</th>
                <th className="font-semibold px-3">Name</th>
                <th className="font-semibold px-3">Email</th>
                <th className="font-semibold px-3">Role</th>
                <th className="font-semibold px-3">Verified</th>
                <th className="font-semibold px-3">Tokens Used</th>
                <th className="font-semibold px-3">Created At</th>
                <th className="font-semibold w-9"></th>
              </tr>
            </thead>
            <tbody className="divide-y gap-4">
              {users.map((user, index) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-100 dark:hover:bg-gray-950 h-14"
                >
                  <td className="p-2">{(page - 1) * limit + index + 1}</td>
                  <td className="px-3">
                    <ProfilePicture
                      size={30}
                      image={
                        user.pfp
                          ? `${`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${user.pfp}`}`
                          : undefined
                      }
                    />
                  </td>
                  <td className="px-3">{user.name}</td>
                  <td className="px-3">{user.email}</td>
                  <td className="px-3"><EditRoleOfUser userId={user.id} currentPage={page} currentRole={user.role}/></td>
                  <td className="px-3"><EditVerification userId={user.id} currentPage={page} currStatus={user.is_verified}/></td>
                  <td className="px-3">{user.ai_tokens_used || 0}</td>
                  <td className="px-3">{user.createdAt.toLocaleDateString().split("T")[0]}</td>
                  <td className="px-2">
                    <DeleteUserBtn userId={user.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      <div className="flex justify-end items-center gap-3 mt-4">
        {page > 1 && (
          <a
            href={`?page=${page - 1}`}
            className="px-3 py-1 border rounded-md text-sm"
          >
            Previous
          </a>
        )}
        <span className="text-sm">
          Page {page} of {totalPages}
        </span>
        {page < totalPages && (
          <a
            href={`?page=${page + 1}`}
            className="px-3 py-1 border rounded-md text-sm"
          >
            Next
          </a>
        )}
      </div>
    </div>
  );
}
