"use client";

import { $Enums } from "@prisma/client/edge";
import React, { useEffect, useRef } from "react";
import MessageBox from "./MessageBox";
import AssistantPicture from "@/components/AssistantPicture";

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
      <div className=" w-5/6 lg:w-4/6 mx-auto flex flex-col">
        {/* Top of the chat */}
        <div className="w-full flex justify-center mt-4 gap-2 flex-col text-center pb-12">
          <h1 className="font-bold font-ubuntu text-3xl ">MediTech</h1>
          <p className="text-gray-500 leading-4">Ask anything about medical or upload your medical report</p>
        </div>
        {/* Messages */}
        {messages.slice().map((ele, i) => (
          <MessageBox key={ele.id} index={i} message={ele} />
        ))}
        {/* This ref ensures auto-scroll to bottom */}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
