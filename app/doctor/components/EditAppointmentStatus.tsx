"use client";

import { changeAppointmentStatus } from "@/actions/doctor.action";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AppointmentStatus } from "@prisma/client/edge";
import { Check, X } from "lucide-react";
import { useActionState, useEffect, useState } from "react";

export default function EditAppointmentStatus({
  appointmentId,
  currentPage,
  currentStatus,
}: {
  currentStatus: AppointmentStatus;
  appointmentId: string;
  currentPage: number;
}) {
  const [status, setStatus] = useState<string>(currentStatus);
  const [showBtns, setShowBtns] = useState<boolean>(false);
  const [state, action, pending] = useActionState(changeAppointmentStatus, undefined);

  useEffect(() => {
    if (status !== currentStatus) setShowBtns(true);
    else{
      setShowBtns(false)
    }
  }, [status]);

  return (
    <>
      <form
        action={action}
        onSubmit={() => {
          setShowBtns(false);
        }}
        className="relative w-fit"
      >
        <input name="currentPage" value={currentPage} readOnly hidden />
        <input name="currentStatus" value={currentStatus} readOnly hidden />
        <input name="appointmentId" value={appointmentId} readOnly hidden />
        <Select value={status} onValueChange={setStatus} name="status">
          <SelectTrigger className="!text-black dark:!text-white">
            <SelectValue placeholder={currentStatus} />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="PENDING">PENDING</SelectItem>
            <SelectItem value="PAYMENT_PENDING">PAYMENT_PENDING</SelectItem>
            <SelectItem value="CONFIRMED">CONFIRMED</SelectItem>
            <SelectItem value="RESCHEDULED">RESCHEDULED</SelectItem>
            <SelectItem value="COMPLETED">COMPLETED</SelectItem>
            <SelectItem value="CANCELLED">CANCELLED</SelectItem>
          </SelectContent>
        </Select>

        {/* Submit Button */}
        {showBtns && (
          <div className="absolute z-10 -top-8 left-0 h-8 w-[70px] flex justify-between items-center">
            <button
              type="submit"
              className="bg-light-4 dark:bg-white text-white dark:text-black h-8 w-8 flex justify-center items-center rounded-sm"
            >
              <Check />
            </button>
            <button
              className="bg-red-600 dark:bg-red-500 text-white dark:text-black h-8 w-8 flex justify-center items-center rounded-sm"
              onClick={() => setStatus(currentStatus)}
            >
              <X />
            </button>
          </div>
        )}
      </form>
    </>
  );
}
