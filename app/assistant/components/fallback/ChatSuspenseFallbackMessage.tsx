"use client";
import React from "react";

export default function ChatSuspenseFallbackMessage({
  isUser,
}: {
  isUser: boolean;
}) {
  return (
    <section
      className={`mx-auto flex flex-col my-1 ${
        !isUser ? "items-start w-full" : "items-end w-4/5"
      } gap-2 w-full lg:w-4/5 p-1 sm:p-3`}
    >
      <div
        className={`gap-2 flex ${
          !isUser ? "flex-row w-full" : "flex-row-reverse w-full lg:w-5/6"
        }`}
      >
        {/* Profile Picture Skeleton */}
        <div className="max-w-[32px] min-w-[32px] min-h-[32px] max-h-[32px] rounded-full bg-gray-300 dark:bg-dark-3 animate-pulse" />

        {/* Message Bubble Skeleton */}
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

      {/* Time Skeleton for User */}
      <div
        className={`flex ${
          isUser ? "justify-start lg:w-5/6 w-full" : "hidden"
        } text-gray-300`}
      >
        <div className="h-4 w-16 bg-gray-300 dark:bg-dark-2 rounded animate-pulse" />
      </div>
    </section>
  );
}
