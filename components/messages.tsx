import { Message } from "@ai-sdk/react";
import React from "react";
import MessageBox from "./message-box";
type Props = { messages: Message[] };

export default function Messages({ messages }: Props) {
  return (
    <div className="flex flex-col gap-4">
        {messages.map((m, index)=><MessageBox key={index} role={m.role} content={m.content}/>)}
    </div>
  )
}
