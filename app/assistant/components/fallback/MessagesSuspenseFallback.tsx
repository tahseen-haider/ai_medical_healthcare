import React from "react";
import ChatSuspenseFallbackMessage from "./ChatSuspenseFallbackMessage";

export default function MessagesSuspenseFallback() {
  return (
    <section className="flex flex-col items-center">
      {/* Scrollable message container */}
      <div className="w-full h-[calc(100vh-65px-120px)] overflow-y-auto">
        <div className="w-full mx-auto flex flex-col pb-20">
          {/* Header skeleton */}
          <div className="w-4/5 mx-auto flex justify-center mt-4 gap-2 flex-col text-center pb-12">
            <h1 className="font-bold font-ubuntu text-3xl text-gray-400 animate-pulse">
              MediTech
            </h1>
            <p className="text-gray-400 leading-4 animate-pulse">
              Ask anything about medical or upload your medical report
            </p>
          </div>

          {/* Skeleton messages */}
          {[true, false, true, false].map((isUser, i) => (
            <ChatSuspenseFallbackMessage key={i} isUser={isUser} />
          ))}
        </div>
      </div>

      {/* Chat Input Skeleton */}
      <div className="lg:w-4/6 w-11/12 bottom-0 bg-gray-50 dark:bg-gray-950">
        <div className="relative border-[1px] border-gray-400 p-3 mb-4 w-full mx-auto rounded-2xl animate-pulse">
          <div className="h-10 bg-gray-300 dark:bg-dark-3 rounded-md w-full mb-3" />
          <div className="flex justify-end">
            <div className="w-9 h-9 rounded-full bg-gray-300 dark:bg-dark-3" />
          </div>
        </div>
      </div>
    </section>
  );
}
