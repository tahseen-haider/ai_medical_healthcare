"use client";

import { changeInquiryStatus } from "@/actions/admin.action";
import React, { useActionState, useState } from "react";

export default function MessageReadButton({
  readStatus,
  inquiryId,
}: {
  inquiryId: string;
  readStatus: boolean;
}) {
  const [status, setStatus] = useState(readStatus);
  return (
    <form action={changeInquiryStatus}>
      <input name="inquiryId" value={inquiryId} hidden readOnly/>
      <button
        onClick={() => {
          setStatus(!status);
        }}
      >
        {status ? (
          <div className="px-2 py-1 text-sm font-semibold text-green-700 bg-green-100 h-fit rounded-md">
            Read
          </div>
        ) : (
          <div className=" px-2 py-1 text-sm font-semibold text-red-700 bg-red-100 h-fit rounded-md">
            Unread
          </div>
        )}
      </button>
    </form>
  );
}
