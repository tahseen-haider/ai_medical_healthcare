"use client";

import React, { useEffect, useRef, useState } from "react";
import MessageBox from "./MessageBox";
import { usePathname } from "next/navigation";
import ChatInputBox from "./ChatInputBox";
import { $Enums } from "@prisma/client/edge";
import { io } from "socket.io-client";

const socket = io("http://localhost:8080");

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
  const [streamingMessage, setStreamingMessage] = useState("");

  useEffect(() => {
    const handleBotMessage = (data: { message: string }) => {
      setStreamingMessage((prev) => prev + data.message);
    };
    const handleStreamDone = () => {
      if (streamingMessage) {
        setMessages((prev) => [
          ...prev,
          {
            content: streamingMessage,
            role: "assistant",
            createdAt: new Date(),
          },
        ]);
        setStreamingMessage(""); // ✅ reset for next stream
      }
    };

    socket.off("botMessage", handleBotMessage);
    socket.on("botMessage", handleBotMessage);

    socket.off("done", handleStreamDone);
    socket.on("done", handleStreamDone);

    return () => {
      socket.off("botMessage", handleBotMessage);
      socket.off("done", handleStreamDone);
    };
  }, [streamingMessage]);

  const [messages, setMessages] = useState(
    initialMessages.map(({ content, role, createdAt }) => ({
      content,
      role,
      createdAt,
    }))
  );
  const [prompt, setPrompt] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const pathname = usePathname();
  const chatId = pathname.split("/assistant/")[1];

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <section className="flex flex-col items-center">
      <div className="w-full h-[calc(100vh-65px-120px)] overflow-y-auto">
        <div className=" w-5/6 lg:w-4/6 mx-auto flex flex-col">
          {/* Top of the chat */}
          <div className="w-full flex justify-center mt-4 gap-2 flex-col text-center pb-12">
            <h1 className="font-bold font-ubuntu text-3xl ">MediTech</h1>
            <p className="text-gray-500 leading-4">
              Ask anything about medical or upload your medical report
            </p>
          </div>
          {/* Messages */}
          {[
            ...messages,
            ...(streamingMessage
              ? [
                  {
                    content: streamingMessage,
                    role: "assistant" as $Enums.MessageRole,
                    createdAt: new Date(),
                  },
                ]
              : []),
          ]
            .filter(Boolean)
            .map((ele, i) => (
              <MessageBox key={i} index={i} message={ele} />
            ))}
          {/* This ref ensures auto-scroll to bottom */}
          <div ref={bottomRef} />
        </div>
      </div>
      {/* Input Box with chatId with every message*/}
      <ChatInputBox
        onSubmit={(e) => {
          e.preventDefault();
          socket.emit("userMessage", { chatId, message: prompt });
            setMessages((prev) => [
              ...prev,
              {
                content: prompt,
                role: "user",
                createdAt: new Date(Date.now()),
              },
            ]);
            setMessages((prev) => [
              ...prev,
              {
                content: streamingMessage,
                role: "assistant",
                createdAt: new Date(Date.now()),
              },
            ]);
          setPrompt("");
        }}
        prompt={prompt}
        setPrompt={setPrompt}
        setMessages={setMessages}
        additionalInputElement={
          <input type="text" name="chatId" readOnly hidden value={chatId} />
        }
      />
    </section>
  );
}
