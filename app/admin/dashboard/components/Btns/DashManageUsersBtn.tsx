"use client";

import Btn from "@/components/Button";
import { redirect } from "next/navigation";

export default function DashManageUsersBtn() {
  return (
    <Btn onClick={() => {redirect("/admin/user-management")}} className="">
      Manage Users
    </Btn>
  );
}
