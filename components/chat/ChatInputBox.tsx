"use client"
import { useEffect, useRef, useState } from "react";
import ReportUploader from "./ReportUploader";
import { ArrowUpFromLine } from "lucide-react";

export default function ChatInputBox({action}: {action: (payload: FormData)=>void}) {
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
        <form action={action}>
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
          </div>
          {/* Buttons */}
          <div className="w-full flex gap-5 justify-end p-2">
            {/* Report Uploader */}
            <ReportUploader />
            {/* Prompt Sender */}
            <button
              type="submit"
              aria-label="Send message"
              className="bg-light-4 text-white p-2 rounded-full relative shadow-light dark:shadow-dark"
            >
              <ArrowUpFromLine size={24} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
