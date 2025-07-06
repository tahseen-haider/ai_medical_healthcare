import { getAllAppointments, getAllUsers } from "@/actions/admin.action";
import DeleteAppointmentBtn from "./Btns/DeleteAppointmentBtn";

export default async function AppointmentsList({
  paramPage,
}: {
  paramPage?: string;
}) {
  const page = parseInt(paramPage || "1", 10);
  const limit = 10;

  const { appointments, totalPages } = await getAllAppointments(page, limit);

  return (
    <div className="w-full py-4 bg-white dark:bg-dark-4 shadow-dark dark:shadow-light rounded-md p-3 min-h-[calc(100vh-170px)] flex flex-col justify-between">
      <div className="flex-1 flex flex-col">
        <div className="w-full flex justify-between">
          <h2 className="font-bold font-ubuntu pb-2">All Appointments:</h2>
        </div>

        <div className="overflow-x-auto flex-1">
          <table className="min-w-full text-sm text-left">
            <thead className="border-b-2 bg-white dark:bg-dark-4 sticky top-0 z-10">
              <tr>
                <th scope="col" className="text-left font-semibold p-3">
                  #
                </th>
                <th scope="col" className="text-left font-semibold px-3">
                  Patient Name
                </th>
                <th scope="col" className="text-left font-semibold px-3">
                  Patient Email
                </th>
                <th scope="col" className="text-left font-semibold px-3">
                  Assigned Doctor
                </th>
                <th scope="col" className="text-left font-semibold px-3">
                  Visit Reason
                </th>
                <th scope="col" className="text-left font-semibold px-3">
                  Visit Time
                </th>
                <th scope="col" className="text-left font-semibold px-3">
                  Visit Date
                </th>
                <th scope="col" className="text-left font-semibold px-3">
                  Appointment Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {appointments.map((appointment, index) => (
                <tr
                  key={appointment.id}
                  className="hover:bg-gray-100 dark:hover:bg-gray-950 h-14"
                >
                  <td className="p-2">{(page - 1) * limit + index + 1}</td>
                  <td className="px-3">{appointment.fullname}</td>
                  <td className="px-3">{appointment.email}</td>
                  <td className="px-3">{appointment.doctor?.name ?? "Unassigned"}</td>
                  <td className="px-3">{appointment.reasonForVisit}</td>
                  <td className="px-3">{appointment.preferredTime}</td>
                  <td className="px-3">{appointment.preferredDate}</td>
                  <td className="px-3">{appointment.status}</td>
                  <td className="px-1"><DeleteAppointmentBtn appId={appointment.id}/></td>
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
