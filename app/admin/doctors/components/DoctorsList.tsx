import { getAllDoctors } from "@/actions/admin.action";
import React from "react";
import AddNewDoctorBtn from "./Btns/AddNewDoctorBtn";
import DeleteDoctorBtn from "./Btns/DeleteDoctorBtn";

export default async function DoctorsList({
  searchParams,
}: {
  searchParams?: { page?: string };
}) {
  const page = parseInt(searchParams?.page || "1", 10);
  const limit = 10;

  const { doctors, totalPages } = await getAllDoctors(page, limit);

  return (
    <div className="w-full py-4 bg-white dark:bg-dark-4 shadow-dark dark:shadow-light rounded-md p-3 min-h-[calc(100vh-170px)] flex flex-col justify-between">
      <div>
        <div className="w-full flex justify-between">
          <h2 className="font-bold font-ubuntu pb-2">All Doctors:</h2>
          <AddNewDoctorBtn />
        </div>

        <table className="min-w-full text-sm text-left">
          <thead>
            <tr>
              <th className="font-semibold p-2 py-3 pr-4">#</th>
              <th className="font-semibold">Name</th>
              <th className="font-semibold">Email</th>
              <th className="font-semibold">Type</th>
              <th className="font-semibold">Created At</th>
              <th className="font-semibold"></th>
            </tr>
          </thead>
          <tbody className="divide-y gap-4">
            {doctors.map((doc, index) => (
              <tr
                key={doc.id}
                className="hover:bg-gray-100 dark:hover:bg-gray-950 h-14"
              >
                <td className="p-2">{(page - 1) * limit + index + 1}</td>
                <td>{doc.name}</td>
                <td>{doc.email}</td>
                <td className="capitalize">{doc.doctorProfile?.doctorType}</td>
                <td>{new Date(doc.createdAt).toLocaleDateString()}</td>
                <td>
                  <DeleteDoctorBtn doctorId={doc.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-end gap-3 mt-4">
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
