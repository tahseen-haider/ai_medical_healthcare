"use client";
import AssistantPicture from "@/components/AssistantPicture";
import Markdown from "@/components/markdown";
import ProfilePicture from "@/components/ProfilePicture";
import { $Enums } from "@prisma/client/edge";
import Image from "next/image";
import React, { useState } from "react";

export default function MessageBox({
  message,
  pfpUrl,
}: {
  uploadedImgID: string | null;
  index: number;
  message: {
    content: string;
    role: $Enums.MessageRole;
    createdAt: Date;
    image: string | null;
  };
  pfpUrl?: string;
}) {
  const [maximizedImg, setMaximizedImg] = useState(false);
  const image = message.image
    ? `https://res.cloudinary.com/dydu5o7ny/image/upload/${message.image}`
    : "";

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
        <div>
          {isUser ? <ProfilePicture image={pfpUrl} /> : <AssistantPicture />}
        </div>
        <div
          className={` ${
            !isUser ? "bg-light-1 dark:bg-dark-4" : "text-white bg-light-4 dark:bg-dark-3"
          } shadow-light dark:shadow-dark w-full rounded-lg py-2 px-4 whitespace-pre-wrap`}
        >
          {message.image && (
            <>
              <Image
                src={image}
                alt="uploaded image"
                height={80}
                width={80}
                quality={40}
                className="rounded-sm cursor-pointer w-auto h-auto mb-3"
                onClick={() => {
                  setMaximizedImg(true);
                }}
              />
              {maximizedImg && (
                <div
                  className="absolute inset-0 w-full h-full backdrop-blur-xs p-6 flex items-center justify-center"
                  onClick={(e) => {
                    setMaximizedImg(false);
                  }}
                >
                  <Image
                    onClick={(e) => {
                      e.stopPropagation();
                    }}
                    src={image}
                    alt="uploaded image"
                    height={1000}
                    width={1000}
                    className="h-full w-fit  object-contain"
                  />
                </div>
              )}
            </>
          )}
          {message.role === "user" ? (
            message.content
          ) : (
            <Markdown text={message.content}></Markdown>
          )}
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
