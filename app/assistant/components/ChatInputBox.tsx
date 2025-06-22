"use client";
import React, { useEffect, useRef, useState } from "react";
import { ArrowUpFromLine, Camera, Loader2, X } from "lucide-react";
import { v4 as uuidv4 } from "uuid";

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
  onCancelImg,
  imageUploaderRef,
  chatId,
  setImageBase64,
  uploadedImgID,
  deleteImageAction,
  setUploadedImgID,
  setIsUploading,
  additionalFormsElements
}: {
  additionalFormsElements?: React.ReactNode
  setIsUploading?: React.Dispatch<React.SetStateAction<boolean>>;
  setUploadedImgID?: React.Dispatch<React.SetStateAction<string | null>>;
  deleteImageAction?: (payload: FormData) => void;
  uploadedImgID?: string | null;
  setImageBase64?: React.Dispatch<React.SetStateAction<string | undefined>>;
  chatId?: string;
  imageUploaderRef?: React.RefObject<HTMLInputElement | null>;
  onCancelImg?: () => void;
  imageBase64?: string;
  isNewChat?: boolean;
  additionalInputElement?: React.ReactNode;
  onSubmit?: React.FormEventHandler<HTMLFormElement>;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  prompt: string;
  pending?: boolean;
  action?: (payload: FormData) => void;
  isGenerating?: boolean;
}) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
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
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  return (
    <div className="lg:w-4/6 w-5/6 bottom-0 bg-gray-50 dark:bg-gray-950">
      <div className="relative border-[1px] border-gray-400 p-1 mb-4 w-full mx-auto rounded-2xl">
        {/* Prompt Form */}
        <form onSubmit={onSubmit} action={action}>
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
            <button
              ref={buttonRef}
              onClick={() => {
                textareaRef.current?.focus();
              }}
              disabled={(!prompt && !imageBase64) || pending}
              type="submit"
              aria-label="Send message"
              className="bg-light-4 dark:bg-dark-3 w-9 h-9 flex items-center text-white p-2 rounded-full relative shadow-light dark:shadow-dark"
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
        {additionalFormsElements && additionalFormsElements}
      </div>
    </div>
  );
}
