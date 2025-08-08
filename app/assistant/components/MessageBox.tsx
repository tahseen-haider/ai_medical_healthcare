"use client";
import AssistantPicture from "@/components/AssistantPicture";
import ProfilePicture from "@/components/ProfilePicture";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { $Enums } from "@prisma/client/edge";
import Image from "next/image";
import React, { useState } from "react";
import { Markdown } from "./Markdown";

export default function MessageBox({
  message,
  pfpUrl,
}: {
  index: number;
  message: {
    content: string;
    role: $Enums.MessageRole;
    createdAt: Date;
    image: string | null;
    base64?: string;
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
      className={`mx-auto flex flex-col my-1 ${
        !isUser ? "items-start w-full" : "items-end w-4/5"
      } gap-2 w-full lg:w-4/5 p-1 sm:p-3`}
    >
      <div
        className={`gap-2 flex ${
          !isUser ? "flex-row w-full " : "flex-row-reverse w-full lg:w-5/6"
        }`}
      >
        <div>
          {isUser ? <ProfilePicture image={pfpUrl} /> : <AssistantPicture />}
        </div>
        <div
          className={` ${
            !isUser
              ? "bg-transparent shadow-none p-0"
              : "py-2 px-4 text-white bg-light-4 dark:bg-dark-4 shadow-light dark:shadow-dark"
          } w-full rounded-sm whitespace-pre-line`}
        >
          {message.base64 && (
            <Image
              src={message.base64}
              alt="uploaded image"
              height={80}
              width={80}
              quality={40}
              className="rounded-sm cursor-pointer w-[80px] h-auto mb-3"
              onClick={() => {
                setMaximizedImg(true);
              }}
            />
          )}

          {message.image && (
            <>
              <Tooltip>
                <TooltipTrigger asChild>
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
                </TooltipTrigger>
                <TooltipContent side="right">Maximize Image</TooltipContent>
              </Tooltip>
              {maximizedImg && (
                <div
                  className="absolute z-40 inset-0 w-full h-full backdrop-blur-xs p-6 flex items-center justify-center"
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
          {/* {message.content} */}
          <Markdown content={message.content}/>
        </div>
      </div>
      <div
        className={`flex ${
          isUser ? "justify-start lg:w-5/6 w-full" : "hidden"
        } text-gray-400`}
      >
        {time}
      </div>
    </section>
  );
}
