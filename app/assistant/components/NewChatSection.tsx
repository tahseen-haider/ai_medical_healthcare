"use client";
import { useActionState, useEffect, useRef, useState } from "react";
import { startNewChat } from "@/actions/chat.action";
import ChatInputBox from "./ChatInputBox";
import { Camera, X } from "lucide-react";

export default function NewChatSection() {
  const [state, action, pending] = useActionState(startNewChat, undefined);
  const [prompt, setPrompt] = useState("");
  const [imageBase64, setImageBase64] = useState<string | undefined>();

  const imageUploaderRef = useRef<HTMLInputElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const submitOnDefaultQuestionsClick = useRef(false);

  const defaultMedicalQuestions = [
    "Why do I feel tired?",
    "What causes headaches?",
    "How to check blood pressure?",
    "Why can't I sleep?",
    "How to stop a cough?",
    "Why am I losing weight?",
  ];

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64 = reader.result as string;
      setImageBase64(base64); // e.g. data:image/png;base64,...
    };
    reader.readAsDataURL(file); // auto-encodes to base64 with mime
  };

  useEffect(() => {
    buttonRef.current?.click();
  }, [submitOnDefaultQuestionsClick.current]);
  return (
    <section className="flex flex-col gap-2 w-full h-[calc(100vh-65px)] items-center justify-center">
      <div className="text-center">
        <h2 className="font-ubuntu text-4xl tracking-tight leading-12">
          What can I help with?
        </h2>
        <p className="text-gray-500 dark:text-gray-300">
          Ask anything about medical or upload your medical report
        </p>
      </div>
      <ChatInputBox
        buttonRef={buttonRef}
        pending={pending}
        action={action}
        prompt={prompt}
        setPrompt={setPrompt}
        imageBase64={imageBase64}
        additionalInputElement={
          <>
            <input
              ref={imageUploaderRef}
              type="file"
              name="image"
              id="imageUpload"
              accept="image/*"
              hidden
              onChange={handleFileChange}
            />
            <div className="absolute right-16 bottom-3 bg-light-4 dark:bg-dark-3 w-9 h-9 flex items-center justify-center text-white p-2 rounded-full shadow-light dark:shadow-dark">
              <label
                htmlFor="imageUpload"
                aria-label="Upload Report"
                className="cursor-pointer"
              >
                <Camera size={24} />
              </label>
            </div>
            {imageBase64 && (
              <button
                disabled={pending}
                onClick={() => {
                  imageUploaderRef.current!.value = "";
                  setImageBase64("");
                }}
                className="absolute bottom-2 right-29 w-10 h-10 flex items-center object-cover overflow-hidden cursor-pointer"
              >
                <X className="absolute text-black w-full h-full opacity-0 hover:opacity-50" />
                <img key={imageBase64} src={imageBase64} alt="uploaded image" />
              </button>
            )}
            <input
              value={imageBase64 || ""}
              type="text"
              name="imageBase64"
              hidden
              readOnly
            />
          </>
        }
      />
      {/* Extra options to choose from */}
      <div className="w-full md:w-4/6 flex flex-wrap">
        {defaultMedicalQuestions.map((ele, index) => (
          <div
            key={index}
            onClick={() => {
              if (pending) return;
              setPrompt(ele);
              submitOnDefaultQuestionsClick.current = true
            }}
            className={`bg-white dark:bg-gray-950 shadow-dark dark:shadow-light px-3 py-1 m-2 rounded-lg ${pending?'cursor-not-allowed':' cursor-pointer hover:bg-light-4 hover:text-white hover:dark:bg-dark-4'}`}
          >
            {ele}
          </div>
        ))}
      </div>
      {state?.message && <p className="text-red-400">{state?.message}</p>}
    </section>
  );
}
