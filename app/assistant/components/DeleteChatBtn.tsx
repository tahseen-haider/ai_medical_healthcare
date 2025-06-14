"use client";

import { Trash2 } from "lucide-react";
import React from "react";

export default function DeleteChatBtn({
  chatId,
  size,
  onClick,
  actionToDeleteChat
}: {
  chatId: string;
  size?: number;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  actionToDeleteChat: (payload: FormData) => void
}) {
  return (
    <>
      <form action={actionToDeleteChat}>
        <input type="text" name="chatId" value={chatId ?? ""} readOnly hidden />
        <button type="submit" className="p-2" onClick={onClick || undefined}>
          <Trash2 size={size || 24} />
        </button>
      </form>
    </>
  );
}
