"use client";
import React from "react";

export default function ChatSuspenseFallbackMessage({
  isUser,
}: {
  isUser: boolean;
}) {
  return (
    <section
      className={`flex flex-col my-3 ${
        !isUser ? "items-start lg:ml-0 -ml-6" : "items-end lg:ml-0 ml-6"
      } gap-2 w-full`}
    >
      <div
        className={`gap-4 flex ${
          !isUser ? "flex-row w-full" : "flex-row-reverse w-full lg:w-5/6"
        }`}
      >
        {/* Profile picture skeleton */}
        <div className="max-w-[32px] min-w-[32px] min-h-[32px] max-h-[32px] rounded-full bg-gray-300 dark:bg-dark-3 animate-pulse" />

        {/* Message bubble skeleton */}
        <div
          className={`${
            !isUser
              ? "bg-light-1 dark:bg-dark-4"
              : "bg-light-4 dark:bg-dark-3 shadow-light dark:shadow-dark"
          } w-full rounded-lg py-4 px-4 animate-pulse`}
        >
          <div className="h-4 bg-gray-300 dark:bg-dark-2 rounded w-3/4 mb-2" />
          <div className="h-4 bg-gray-300 dark:bg-dark-2 rounded w-1/2" />
        </div>
      </div>
      <div
        className={`lg:w-5/6 w-full flex ${
          isUser ? "justify-start" : "hidden"
        } text-gray-300`}
      >
        <div className="h-4 w-16 bg-gray-300 dark:bg-dark-2 rounded animate-pulse" />
      </div>
    </section>
  );
}
