import { getAllVerifiedUsers } from "@/actions/admin.action";
import ProfilePicture from "@/components/ProfilePicture";
import DashManageUsersBtn from "./Btns/DashManageUsersBtn";

export default async function AdminDashboardRecentUsers() {
  const verifiedUsers = await getAllVerifiedUsers();

  return (
    <div className="w-full py-4 bg-white dark:bg-dark-4 shadow-dark dark:shadow-light rounded-md p-3">
      {/* Heading */}
      <h2 className="font-bold font-ubuntu pb-2">Recent Members:</h2>
      {/* Table */}
      <div className="max-h-[210px] overflow-y-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="border-b-2 font-semibold sticky top-0 z-10 bg-white dark:bg-dark-4">
            <tr>
              <th className="p-2 py-3 pr-4">#</th>
              <th className="px-3">Avatar</th>
              <th className="px-3">Name</th>
              <th className="px-3">Role</th>
              <th className="px-3">Email</th>
              <th className="px-3">Created At</th>
            </tr>
          </thead>
          <tbody className="divide-y gap-4">
            {verifiedUsers.map((user, index) => (
              <tr
                key={index}
                className="hover:bg-gray-200 hover:dark:bg-gray-950 p-2"
              >
                <td className="p-2 py-4 font-bold">{index + 1}</td>
                <td className="px-3">
                  <ProfilePicture
                    size={30}
                    image={
                      user.pfp
                        ? `${`https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${user.pfp}`}`
                        : undefined
                    }
                  />
                </td>
                <td className="px-3">{user.name}</td>
                <td className="px-3">{user.role}</td>
                <td className="px-3">{user.email}</td>
                <td className="px-3">{user.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Button */}
      <div className="w-fit mx-auto mt-4">
        <DashManageUsersBtn />
      </div>
    </div>
  );
}
