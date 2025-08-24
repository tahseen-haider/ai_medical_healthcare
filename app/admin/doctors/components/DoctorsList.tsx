import React from "react";
import AddNewDoctorBtn from "./Btns/AddNewDoctorBtn";
import DeleteDoctorBtn from "./Btns/DeleteDoctorBtn";
import ProfilePicture from "@/components/ProfilePicture";
import { getDoctorsForLoadMore } from "@/actions/doctor.action";
import Link from "next/link";

export default async function DoctorsList({
  paramPage,
}: {
  paramPage?: string;
}) {
  const page = parseInt(paramPage || "1", 10);
  const limit = 10;

  const { doctors, totalPages } = await getDoctorsForLoadMore(page, limit);

  return (
    <div className="w-full py-4 bg-white dark:bg-dark-4 shadow-dark dark:shadow-light rounded-md p-3 min-h-[calc(100vh-170px)] flex flex-col justify-between">
      <div className="flex-1 flex flex-col">
        <div className="w-full flex justify-between">
          <h2 className="font-bold font-ubuntu pb-2">All Doctors:</h2>
          <AddNewDoctorBtn />
        </div>

        <div className="overflow-x-auto flex-1">
          <table className="min-w-full text-sm text-left">
            <thead className="border-b-2 bg-white dark:bg-dark-4 sticky top-0 z-10">
              <tr>
                <th className="font-semibold p-2 py-3 pr-4">#</th>
                <th className="font-semibold px-3">Avatar</th>
                <th className="font-semibold px-3 min-w-[100px]">Name</th>
                <th className="font-semibold px-3">Email</th>
                <th className="font-semibold px-3">Type</th>
                <th className="font-semibold px-3">Rating</th>
                <th className="font-semibold px-3">Fee</th>
                <th className="font-semibold px-3">Created At</th>
                <th className="font-semibold w-9"></th>
              </tr>
            </thead>
            <tbody className="divide-y gap-4">
              {doctors.map((doc, index) => (
                <tr
                  key={doc.id}
                  className="hover:bg-gray-100 dark:hover:bg-gray-950 h-14"
                >
                  <td className="p-2">{(page - 1) * limit + index + 1}</td>
                  <td className="px-3">
                    <Link target="_blank" href={`/profile/doctor/${doc.id}`}><ProfilePicture
                      size={30}
                      image={
                        doc.pfp
                          ? `${`https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${doc.pfp}`}`
                          : undefined
                      }
                    /></Link>
                  </td>
                  <td className="px-3">{doc.name}</td>
                  <td className="px-3">{doc.email}</td>
                  <td className="capitalize px-3">
                    {doc.doctorProfile?.doctorType}
                  </td>
                  <td className="capitalize px-3">
                    {doc.doctorProfile?.ratings}
                  </td>
                  <td className="capitalize px-3">
                    {doc.doctorProfile?.consultationFee}
                  </td>
                  <td className="px-3">
                    {doc.createdAt.toLocaleDateString("en-GB")}
                  </td>
                  <td className="px-2">
                    <DeleteDoctorBtn doctorId={doc.id} />
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
