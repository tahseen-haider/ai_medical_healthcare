import { getInquiries } from "@/actions/admin.action"

export default async function AdminDashboardRecentInquiries() {
  const inquiries = await getInquiries();
  
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
                    <th className="font-semibold">Name</th>
                    <th className="font-semibold">Email</th>
                    <th className="font-semibold">Message</th>
                  </tr>
                </thead>
                <tbody className="divide-y gap-4">
                  {inquiries.map((inquiry, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-200 hover:dark:bg-gray-950 p-2"
                    >
                      <td className="p-2 py-4">{index + 1}</td>
                      <td className="">{inquiry.name}</td>
                      <td className="">{inquiry.email}</td>
                      <td className="">{inquiry.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Table */}
            <div className="w-fit mx-auto mt-4">
              {/* <DashManageUsersBtn /> */}
            </div>
          </div>
  )
}
