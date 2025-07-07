"use client";

import { changeUserRole } from "@/actions/admin.action";
import LoadingScreen from "@/components/LoadingScreen";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRole } from "@prisma/client/edge";
import { Check, X } from "lucide-react";
import { useActionState, useEffect, useState } from "react";

export default function EditRoleOfUser({
  userId,
  currentPage,
  currentRole,
}: {
  currentRole: UserRole;
  userId: string;
  currentPage: number;
}) {
  const [role, setRole] = useState<string>(currentRole);
  const [showBtns, setShowBtns] = useState<boolean>(false);
  const [state, action, pending] = useActionState(changeUserRole, undefined);

  useEffect(() => {
    if (role !== currentRole) setShowBtns(true);
    else {
      setShowBtns(false);
    }
  }, [role]);

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
        <input name="currentRole" value={currentRole} readOnly hidden />
        <input name="userId" value={userId} readOnly hidden />
        <Select value={role} onValueChange={setRole} name="role">
          <SelectTrigger className="!text-black dark:!text-white">
            <SelectValue placeholder={currentRole} />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="user">User</SelectItem>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="doctor">Doctor</SelectItem>
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
              onClick={() => setRole(currentRole)}
            >
              <X />
            </button>
          </div>
        )}
      </form>
    </>
  );
}
