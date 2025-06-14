"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import MessageBox from "./MessageBox";
import { usePathname } from "next/navigation";
import ChatInputBox from "./ChatInputBox";
import { $Enums } from "@prisma/client/edge";
import { getSocket } from "@/lib/socket";

const socket = getSocket();

export default function Messages({
  initialMessages,
}: {
  initialMessages: {
    content: string;
    chatId: string;
    id: string;
    role: $Enums.MessageRole;
    createdAt: Date;
  }[];
}) {
  const [messages, setMessages] = useState(
    initialMessages.map(({ content, role, createdAt }) => ({
      content,
      role,
      createdAt,
    }))
  );

  const [isGenerating, setIsGenerating] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const chatId = pathname.split("/assistant/")[1];

  // Scroll to bottom on new messages
useLayoutEffect(() => {
  const timeout = setTimeout(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, 100);
  return () => clearTimeout(timeout);
}, [messages]);

  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role === "user") {
      socket.emit("userMessage", {
        message: lastMessage.content,
        chatId,
        isNew: true,
      });
    }
  }, []);

  useEffect(() => {
    const handleBotMessage = (data: { message: string }) => {
      setIsGenerating(true);
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        // If last message is from assistant, append to it
        if (last?.role === "assistant") {
          const updatedLast = {
            ...last,
            content: last.content + data.message,
          };
          return [...prev.slice(0, -1), updatedLast];
        }
        // Otherwise, start a new assistant message
        return [
          ...prev,
          {
            content: data.message,
            role: "assistant",
            createdAt: new Date(),
          },
        ];
      });
    };

    const handleStreamDone = () => {
      setIsGenerating(false);
      // Optional: If you want to trigger anything at end
    };

    socket.on("botMessage", handleBotMessage);
    socket.on("done", handleStreamDone);

    return () => {
      socket.off("botMessage", handleBotMessage);
      socket.off("done", handleStreamDone);
    };
  }, []);

  const [prompt, setPrompt] = useState("");

  return (
    <section className="flex flex-col items-center">
      <div className="w-full h-[calc(100vh-65px-120px)] overflow-y-auto">
        <div className=" w-5/6 lg:w-4/6 mx-auto flex flex-col">
          <div className="w-full flex justify-center mt-4 gap-2 flex-col text-center pb-12">
            <h1 className="font-bold font-ubuntu text-3xl">MediTech</h1>
            <p className="text-gray-500 leading-4">
              Ask anything about medical or upload your medical report
            </p>
          </div>

          {messages.map((ele, i) => (
            <MessageBox key={i} index={i} message={ele} />
          ))}
        </div>
        <div ref={bottomRef} />
      </div>

      <ChatInputBox
        onSubmit={(e) => {
          e.preventDefault();
          socket.emit("userMessage", { chatId, message: prompt, isNew: false });
          setMessages((prev) => [
            ...prev,
            {
              content: prompt,
              role: "user",
              createdAt: new Date(),
            },
          ]);
          setPrompt("");
        }}
        prompt={prompt}
        setPrompt={setPrompt}
        setMessages={setMessages}
        pending={isGenerating}
        additionalInputElement={
          <input type="text" name="chatId" readOnly hidden value={chatId} />
        }
      />
    </section>
  );
}
