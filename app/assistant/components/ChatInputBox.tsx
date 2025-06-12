"use client"
import React, { useEffect, useRef, useState } from "react";
import { ArrowUpFromLine, Loader2 } from "lucide-react";
import ReportUploader from "./ReportUploader";

export default function ChatInputBox({action, additionalInputElement, pending}: {action: (payload: FormData)=>void, additionalInputElement?: React.ReactNode, pending?: boolean}) {
  const [prompt, setPrompt] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "0px"; // reset first
      textarea.style.height = Math.min(textarea.scrollHeight, 88) + "px"; 
    }
  }, [prompt]);
  return (
    <div className="lg:w-4/6 w-5/6 bottom-0 bg-light-1 dark:bg-dark-4">
      <div className="border-[1px] border-gray-400 p-1 mb-4 w-full mx-auto rounded-2xl">
        <form action={action} onSubmit={()=>setPrompt('')}>
          <div className="flex flex-col-reverse w-full">
            <textarea
              ref={textareaRef}
              name="userPrompt"
              className="w-full resize-none focus:outline-none p-2 font-roboto leading-[22px] -tracking-tight max-h-[132px] overflow-y-auto rounded-md"
              placeholder="Ask anything"
              rows={2}
              required
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            {additionalInputElement && additionalInputElement}
          </div>
          {/* Buttons */}
          <div className="w-full flex gap-5 justify-end p-2">
            {/* Report Uploader */}
            <ReportUploader />
            {/* Prompt Sender */}
            <button
              disabled={pending}
              type="submit"
              aria-label="Send message"
              className="bg-light-4 text-white p-2 rounded-full relative shadow-light dark:shadow-dark"
              style={pending ? { pointerEvents: 'none', cursor: 'not-allowed' } : {}}
            >
              {!pending? <ArrowUpFromLine size={24} />: <Loader2 className="animate-spin"/>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
