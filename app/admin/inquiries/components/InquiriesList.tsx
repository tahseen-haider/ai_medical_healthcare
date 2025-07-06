import {
  getInquiries,
  getInquiriesForPagination,
} from "@/actions/admin.action";
import MessageReadButton from "./Btns/MessageReadButton";
import DeleteInquiryButton from "./Btns/DeleteInquiryButton";

export default async function UsersList({ paramPage }: { paramPage?: string }) {
  const page = parseInt(paramPage || "1", 10);
  const limit = 4;

  const { inquiries, totalPages } = await getInquiriesForPagination(
    page,
    limit
  );

  return (
    <div className="w-full py-4 bg-white dark:bg-dark-4 shadow-dark dark:shadow-light rounded-md p-3 min-h-[calc(100vh-170px)] flex flex-col">
      <div className="flex flex-col border-b-2">
        <div className="w-full flex justify-between">
          <h2 className="font-bold font-ubuntu pb-2">All Inquiries:</h2>
        </div>
      </div>
      {/* Table */}
      <div className="overflow-y-auto flex-1">
        {inquiries.map((inquiry, index) => (
          <div
            key={index}
            className="border-b-[1px] w-full flex items-center hover:bg-gray-200 hover:dark:bg-gray-950"
          >
            <div className="w-full  flex justify-between gap-4 p-2">
              <div className="flex gap-4 w-full mr-3">
                <div className="text-lg font-bold">{index + 1}</div>
                <div className="flex flex-col gap-3 w-full">
                  <div className="flex gap-2 items-center justify-between flex-1">
                    <div className="flex gap-2 items-center">
                      <div className="text-lg font-bold">
                        {inquiry.fullname}
                      </div>
                      <p className="text-gray-700 dark:text-gray-400 px-3">
                        @{inquiry.email}
                      </p>
                    </div>
                    <MessageReadButton
                      readStatus={inquiry.is_read}
                      inquiryId={inquiry.id}
                    />
                  </div>
                  <div>{inquiry.inquiry}</div>
                </div>
              </div>
              <div className="min-w-3 h-full bg-pink-700"></div>
            </div>
            <DeleteInquiryButton inquiryId={inquiry.id} page={page} />
          </div>
        ))}
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
