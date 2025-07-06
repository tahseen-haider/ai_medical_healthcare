import { getInquiries } from "@/actions/admin.action";
import DashManageMessagesBtn from "./Btns/DashManageMessagesBtn";
import MessageReadButton from "../../inquiries/components/Btns/MessageReadButton";
export default async function AdminDashboardRecentInquiries() {
  const inquiries = await getInquiries();

  return (
    <div className="w-full py-4 bg-white dark:bg-dark-4 shadow-dark dark:shadow-light rounded-md">
      {/* Heading */}
      <h2 className="font-bold font-ubuntu pb-2 pl-2">Recent Messages:</h2>
      {/* Table */}
      <div className="h-[210px] max-h-[210px] overflow-y-auto">
        {inquiries.map((inquiry, index) => (
          <div
            key={index}
            className="w-full border-b-[1px] flex justify-between hover:bg-gray-200 hover:dark:bg-gray-950 p-2"
          >
            <div className="flex gap-4 w-full mr-3">
              <div className="text-lg font-bold">{index + 1}</div>
              <div>
                <div className="flex gap-2 items-center">
                  <div className="text-lg font-bold">{inquiry.name}</div>
                  <p className="text-gray-700 dark:text-gray-400 px-3">
                    @{inquiry.email}
                  </p>
                </div>
                <div>{inquiry.message}</div>
              </div>
            </div>
            <MessageReadButton inquiryId={inquiry.id} readStatus={inquiry.is_read}/>
          </div>
        ))}
      </div>
      {/* Button */}
      <div className="w-fit mx-auto mt-4">{
      <DashManageMessagesBtn/>
      }</div>
    </div>
  );
}
