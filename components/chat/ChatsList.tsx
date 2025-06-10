import { getChatList } from "@/actions/chat.action";
import React from "react";

export default function ChatsList() {
  // const chatsList = await getChatList();
   
  return (
    <div>
      {chatsList?.map((ele) => (
        <div className="h-10 w-full border-2 bg-light-2 dark:bg-dark-2 text-black dark:text-white rounded-lg flex items-center p-3 font-bold font-ubuntu ">
          Ch
        </div>
      ))}
    </div>
  );
}
