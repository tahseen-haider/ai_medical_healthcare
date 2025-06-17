"use client";
import React, { useEffect, useRef, useState } from "react";
import { ArrowUpFromLine, Loader2, X } from "lucide-react";
import ReportUploader from "./ReportUploader";
import { $Enums } from "@prisma/client/edge";

export default function ChatInputBox({
  isNewChat,
  additionalInputElement,
  onSubmit,
  setPrompt,
  prompt,
  pending,
  action,
  isGenerating,
  imageBase64,
  setImageBase64,
}: {
  imageBase64?: string;
  setImageBase64?: React.Dispatch<React.SetStateAction<string | undefined>>;
  isNewChat?: boolean;
  additionalInputElement?: React.ReactNode;
  setMessages?: React.Dispatch<
    React.SetStateAction<
      {
        content: string;
        role: $Enums.MessageRole;
        createdAt: Date;
      }[]
    >
  >;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  prompt: string;
  pending?: boolean;
  action?: (payload: FormData) => void;
  isGenerating?: boolean;
}) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "0px"; // reset first
      textarea.style.height = Math.min(textarea.scrollHeight, 88) + "px";
    }
  }, [prompt]);
  function handleKeyDown(
    event: React.KeyboardEvent<HTMLTextAreaElement>
  ): void {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      buttonRef.current?.click();
    }
  }

  return (
    <div className="lg:w-4/6 w-5/6 bottom-0 bg-light-1 dark:bg-dark-4">
      <div className="border-[1px] border-gray-400 p-1 mb-4 w-full mx-auto rounded-2xl">
        <form onSubmit={onSubmit} action={action ? action : undefined}>
          <div className="flex flex-col-reverse w-full">
            <textarea
              required={isNewChat}
              onKeyDown={handleKeyDown}
              autoFocus
              ref={textareaRef}
              name="userPrompt"
              className="w-full resize-none focus:outline-none p-2 font-roboto leading-[22px] -tracking-tight max-h-[132px] overflow-y-auto rounded-md"
              placeholder="Ask anything"
              rows={2}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            {additionalInputElement && additionalInputElement}
          </div>
          {/* Buttons */}
          <div className="w-full flex gap-5 justify-end p-2">
            {imageBase64 && (
              <div
                className="relative w-10 h-10 object-cover overflow-hidden cursor-pointer"
                onClick={() => {
                  setImageBase64!("");
                }}
              >
                <X className="absolute text-black w-full h-full opacity-0 hover:opacity-50" />
                <img key={imageBase64} src={imageBase64} alt="uploaded image" />
              </div>
            )}
            {/* Report Uploader */}
            {!isNewChat && <ReportUploader />}
            {/* Prompt Sender */}
            <button
              ref={buttonRef}
              onClick={() => {
                textareaRef.current?.focus();
              }}
              disabled={pending}
              type="submit"
              aria-label="Send message"
              className="bg-light-4 text-white p-2 rounded-full relative shadow-light dark:shadow-dark"
              style={
                pending ? { pointerEvents: "none", cursor: "not-allowed" } : {}
              }
            >
              {!pending ? (
                <ArrowUpFromLine size={24} />
              ) : (
                <Loader2 className="animate-spin" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
