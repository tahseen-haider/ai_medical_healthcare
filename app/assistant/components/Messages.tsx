import { $Enums } from "@prisma/client/edge";
import React from "react";

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
  return (
    <div className="h-full flex flex-col-reverse">
      {messages.reverse().map((ele, i) => (
        <p key={i}>{ele.content}</p>
      ))}
    </div>
  );
}
