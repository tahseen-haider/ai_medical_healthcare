"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
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
  const pathname = usePathname();
  const chatId = pathname.split('/assistant/')[1]
  console.log(chatId)
  return (
    <>
      {chatsList?.map((ele, index) => (
        <Link
          href={`/assistant/${ele.id}`}
          key={index}
          className={`h-10 w-full border-2 ${
            ele.id === chatId
              ? "bg-light-2 dark:bg-dark-2  font-bold"
              : "bg-light-1 dark:bg-dark-4 font-normal"
          } text-black dark:text-white rounded-lg flex items-center p-3 font-ubuntu cursor-pointer`}
        >
          {(ele.title)?.slice(0,30)}
        </Link>
      ))}
    </>
  );
}
