"use client";

import {
  changeUserRole,
  changeUserVerificationStatus,
} from "@/actions/admin.action";
import LoadingScreen from "@/components/LoadingScreen";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Check, X } from "lucide-react";
import { useActionState, useEffect, useState } from "react";

export default function EditVerification({
  userId,
  currentPage,
  currStatus,
}: {
  currStatus: boolean;
  userId: string;
  currentPage: number;
}) {
  const currentStatus: string = currStatus ? "1" : "0";
  const [status, setStatus] = useState<string>(
    currentStatus === "1" ? "1" : "0"
  );
  const [state, action, pending] = useActionState(
    changeUserVerificationStatus,
    undefined
  );

  const [showBtns, setShowBtns] = useState<boolean>(false);

  useEffect(() => {
    if (status !== currentStatus) setShowBtns(true);
  }, [status]);

  return (
    <>
      <form action={action} onSubmit={()=>{setShowBtns(false)}} className="relative w-fit">
        <input name="currentPage" value={currentPage} readOnly hidden />
        <input
          name="currentStatus"
          value={currentStatus === "1" ? "1" : "0"}
          readOnly
          hidden
        />
        <input name="userId" value={userId} readOnly hidden />
        <Select value={status} onValueChange={setStatus} name="status">
          <SelectTrigger className="!text-black dark:!text-white">
            <SelectValue placeholder={currentStatus} />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="1">Verified</SelectItem>
            <SelectItem value="0">Un-Verified</SelectItem>
          </SelectContent>
        </Select>

        {/* Submit Button */}
        {showBtns && (
          <div className="absolute z-10 -top-8 -right-17 h-8 w-[70px] flex justify-between items-center">
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
