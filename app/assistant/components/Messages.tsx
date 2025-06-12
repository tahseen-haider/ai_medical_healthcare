"use client";

import { $Enums } from "@prisma/client/edge";
import React, { useEffect, useRef } from "react";
import MessageBox from "./MessageBox";

export default function Messages({
  messages,
}: {
  messages: {
    content: string;
    chatId: string;
    id: string;
    role: $Enums.MessageRole;
    createdAt: Date;
  }[];
}) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="w-full h-[calc(100vh-65px-120px)] overflow-y-scroll ">
      <div className=" w-5/6 lg:w-4/6 mx-auto flex flex-col pt-10">
        {messages.slice().map((ele, i) => (
          <MessageBox key={ele.id} index={i} message={ele} />
        ))}
        {/* This ref ensures auto-scroll to bottom */}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
