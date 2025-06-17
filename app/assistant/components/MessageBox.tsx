"use client";
import AssistantPicture from "@/components/AssistantPicture";
import Markdown from "@/components/markdown";
import ProfilePicture from "@/components/ProfilePicture";
import { $Enums } from "@prisma/client/edge";
import React from "react";

export default function MessageBox({
  index,
  message,
  imageUrl
}: {
  index: number;
  message: {
    content: string;
    role: $Enums.MessageRole;
    createdAt: Date;
  };
  imageUrl?:string
}) {
  const time = message.createdAt.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  const isUser = message.role === "user";
  return (
    <section
      className={`flex flex-col my-3 ${
        !isUser ? "items-start lg:ml-0 -ml-6" : "items-end lg:ml-0 ml-6"
      } gap-2 w-full `}
    >
      <div
        className={`gap-4 flex w-full lg:w-5/6 ${
          !isUser ? "flex-row" : "flex-row-reverse"
        }`}
      >
        <div>{isUser ? <ProfilePicture image={imageUrl}/> : <AssistantPicture />}</div>
        <div
          className={` ${
            !isUser ? "bg-light-1 dark:bg-dark-4" : "bg-light-2 dark:bg-dark-3"
          } shadow-light dark:shadow-dark w-full rounded-lg py-2 px-4 whitespace-pre-wrap`}
        >
          <Markdown text={message.content}></Markdown>
        </div>
      </div>
      <div
        className={`lg:w-5/6 w-full flex ${
          isUser ? "justify-start" : "justify-end"
        } text-gray-400`}
      >
        {time}
      </div>
    </section>
  );
}
