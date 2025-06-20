"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { useActionState } from "react";
import DeleteChatBtn from "./DeleteChatBtn";
import { deleteChat } from "@/actions/chat.action";
import LoadingScreen from "@/components/LoadingScreen";
type chatsListType =
  | {
      userId: string;
      id: string;
      createdAt: Date;
      title: string | null;
      updatedAt: Date;
    }[]
  | undefined;

export default function ChatList({ chatsList }: { chatsList: chatsListType }) {
  const pathname = usePathname() ?? "";
  const chatId = pathname.length > 0 ? pathname.split("/assistant/")[1] : "";
  const [stateOfDeleteChat, actionToDeleteChat, pendingOfDeleteChat] =
    useActionState(deleteChat, undefined);

  return (
    <>
      {pendingOfDeleteChat && <LoadingScreen message="Deleting this chat..."/>}
      {chatsList?.map((ele, index) => (
        <Link
          href={`/assistant/${ele.id}`}
          key={index}
          className={`h-10 w-full border-2 ${
            ele.id === chatId
              ? "bg-light-4 dark:bg-dark-2 font-bold text-white dark:text-white"
              : "bg-light-1 dark:bg-dark-4 font-normal"
          } rounded-lg flex items-center font-ubuntu cursor-pointer`}
        >
          <div className="flex justify-between w-full pl-3 items-center">
            {ele.title?.slice(0, 30)}
            <div className="z-10 rounded-md hover:bg-light-3/40 hover:dark:bg-dark-2/40">
              <DeleteChatBtn
                chatId={ele.id}
                size={18}
                onClick={(e) => {
                  e.stopPropagation();
                }}
                actionToDeleteChat={actionToDeleteChat}
              />
            </div>
          </div>
        </Link>
      ))}
    </>
  );
}
