"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import MessageBox from "./MessageBox";
import { usePathname } from "next/navigation";
import ChatInputBox from "./ChatInputBox";
import { $Enums } from "@prisma/client/edge";
import { getSocket } from "@/lib/socket";
import { v4 as uuidv4 } from "uuid";

const socket = getSocket();

export default function Messages({
  initialMessages,
  pfpUrl,
}: {
  initialMessages: {
    content: string;
    chatId: string;
    id: string;
    role: $Enums.MessageRole;
    createdAt: Date;
    image: string | null;
  }[];
  pfpUrl?: string;
}) {
  const pathname = usePathname();
  const chatId = pathname.split("/assistant/")[1];

  // States
  const [messages, setMessages] = useState(
    initialMessages.map(({ id, content, role, createdAt, image }) => ({
      id,
      content,
      role,
      createdAt,
      image,
    }))
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImgID, setUploadedImgID] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | undefined>();
  const [prompt, setPrompt] = useState("");

  // Refs
  const imageUploaderRef = useRef<HTMLInputElement | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Functions
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setImageBase64(base64); // e.g. data:image/png;base64,...
      setIsUploading(true);
      socket.emit("uploadImage", { image: base64, chatId });
    };
    reader.readAsDataURL(file); // auto-encodes to base64 with mime
  };
  const randomId = () => uuidv4();

  // Scroll to bottom on new messages
  useLayoutEffect(() => {
    const timeout = setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    return () => clearTimeout(timeout);
  }, [messages]);

  // If last message is not answered run this
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role === "user") {
      socket.emit("userMessage", {
        message: lastMessage.content,
        chatId,
        isOldMessage: true,
        public_id: lastMessage.image,
      });
    }
  }, []);

  // To handle the backend response
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
            image: null,
            id: last.id,
          };
          return [...prev.slice(0, -1), updatedLast];
        }
        // Otherwise, start a new assistant message
        return [
          ...prev,
          {
            id: randomId(),
            content: data.message,
            role: "assistant",
            createdAt: new Date(),
            image: null,
          },
        ];
      });
    };

    const handleStreamDone = () => {
      setIsGenerating(false);
      // Optional: If you want to trigger anything at end
    };

    const handleImageUploaded = (data: { public_image_id: string }) => {
      setUploadedImgID(data.public_image_id);
      setIsUploading(false);
    };

    const handleImageDeleted = () => {
      setIsUploading(false);
    };

    socket.off("botMessage").on("botMessage", handleBotMessage);
    socket.off("done").on("done", handleStreamDone);
    socket.off("imageUploaded").on("imageUploaded", handleImageUploaded);
    socket.off("imageDeleted").on("imageDeleted", handleImageDeleted);

    return () => {
      socket.off("botMessage", handleBotMessage);
      socket.off("done", handleStreamDone);
      socket.off("imageUploaded", handleImageUploaded);
      socket.off("imageDeleted", handleImageUploaded);
    };
  }, []);

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
          {/* Messages */}
          {messages.map((ele, i) => (
            <MessageBox
              key={i}
              index={i}
              message={ele}
              pfpUrl={pfpUrl}
              uploadedImgID={uploadedImgID}
            />
          ))}
        </div>
        <div ref={bottomRef} />
      </div>
      {/* Chat Input */}
      <ChatInputBox
        onCancelImg={() => {
          if(isUploading) return;
          setIsUploading(true);
          socket.emit("deleteImage", {uploadedImgID});
          if (imageUploaderRef.current) imageUploaderRef.current.value = "";
          setImageBase64("");
          // Delete the cloudinary image here when cancel button is clicked
        }}
        imageBase64={imageBase64}
        onSubmit={(e) => {
          e.preventDefault();

          if (!imageBase64 && !prompt) return;

          const newMessage: any = {
            chatId,
            isOldMessage: false,
          };

          if (prompt) {
            newMessage.message = prompt;
          }

          if (imageBase64) {
            newMessage.image = imageBase64;
            newMessage.public_id = uploadedImgID;
          }

          socket.emit("userMessage", newMessage);

          setMessages((prev) => [
            ...prev,
            {
              id: randomId(),
              content: prompt || "Image Uploaded!",
              role: "user",
              createdAt: new Date(),
              image: uploadedImgID,
            },
          ]);
          setImageBase64("");
          setPrompt("");
        }}
        prompt={prompt}
        setPrompt={setPrompt}
        pending={isGenerating || isUploading}
        additionalInputElement={
          <>
            <input type="text" name="chatId" readOnly hidden value={chatId} />
            <input
              ref={imageUploaderRef}
              type="file"
              name="image"
              id="imageUpload"
              accept="image/*"
              hidden
              onChange={handleFileChange}
              disabled={isUploading}
            />
          </>
        }
      />
    </section>
  );
}
