"use client";

import useSWR from "swr";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { deleteChat, getChatList } from "@/actions/chat.action";
import DeleteChatBtn from "./DeleteChatBtn";
import LoadingScreen from "@/components/LoadingScreen";
import { useActionState } from "react";
import ChatListSuspenseFallback from "./fallback/ChatListSuspenseFallback";

const fetcher = () => getChatList();

export default function ChatListWrapper() {
  const { data: chatsList, isLoading } = useSWR("chat-list", fetcher, {
    refreshInterval: 5000,
  });
  const [stateOfDeleteChat, actionToDeleteChat, pendingOfDeleteChat] =
    useActionState(deleteChat, undefined);

  const pathname = usePathname();
  const chatId = pathname?.split("/assistant/")[1];

  return (
    <>
      {pendingOfDeleteChat && <LoadingScreen message="Deleting your chat..." />}
      {isLoading && <ChatListSuspenseFallback />}
      {chatsList?.map((ele) => (
        <Link
          href={`/assistant/${ele.id}`}
          key={ele.id}
          className={`h-10 w-full border-[1px] ${
            ele.id === chatId
              ? "bg-light-4 dark:bg-dark-4 font-normal text-white"
              : "bg-light-1 dark:bg-gray-950"
          } rounded-lg flex items-center font-ubuntu cursor-pointer`}
        >
          <div className="flex justify-between w-full pl-3 items-center">
            {ele.title?.slice(0, 30) || "Untitled Chat"}
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
