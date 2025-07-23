"use client";

import { deleteChat } from "@/actions/chat.action";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Loader2, Trash2 } from "lucide-react";
import React, { useActionState } from "react";

export default function DeleteChatBtn({
  chatId,
  size,
  onClick,
}: {
  chatId: string;
  size?: number;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}) {
  const [stateOfDeleteChat, actionToDeleteChat, pendingOfDeleteChat] =
    useActionState(deleteChat, undefined);
  return (
    <>
      <form action={actionToDeleteChat}>
        <input type="text" name="chatId" value={chatId ?? ""} readOnly hidden />
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              disabled={pendingOfDeleteChat}
              type="submit"
              className="p-2"
              onClick={onClick || undefined}
            >
              {pendingOfDeleteChat ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Trash2 size={size || 24} />
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">Delete Chat</TooltipContent>
        </Tooltip>
      </form>
    </>
  );
}
