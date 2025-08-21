"use client";
import { useActionState, useEffect, useRef, useState } from "react";
import { startNewChat } from "@/actions/chat.action";
import ChatInputBox from "./ChatInputBox";
import { Bot, Camera, X } from "lucide-react";
import MessageBox from "./MessageBox";
import { MessageRole } from "@prisma/client/edge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function NewChatSection({ userId }: { userId: string }) {
  const [state, action, pending] = useActionState(startNewChat, undefined);
  const [prompt, setPrompt] = useState("");
  const [userPrompt, setUserPrompt] = useState("");
  const [imageBase64, setImageBase64] = useState<string | undefined>();

  const imageUploaderRef = useRef<HTMLInputElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const submitOnDefaultQuestionsClick = useRef(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

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
      setImageBase64(base64);
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    buttonRef.current?.click();
  }, [submitOnDefaultQuestionsClick.current]);

  return isSubmitted ? (
    <section className="flex flex-col items-center w-full">
      <div className="w-full h-[calc(100vh-65px-120px)] overflow-y-auto">
        <div className="w-full mx-auto flex flex-col pb-20">
          {/* Header */}
          <div className="w-4/5 mx-auto flex justify-center mt-4 gap-2 flex-col text-center pb-12">
            <h1 className="font-bold font-ubuntu text-3xl">MediTech</h1>
            <p className="text-gray-500 leading-4">
              Ask anything about medical or upload your medical report
            </p>
          </div>

          {/* Initial messages */}
          {[
            {
              content: userPrompt || "Image Uploaded",
              role: "user" as MessageRole,
              createdAt: new Date(),
              image: "",
              base64: imageBase64,
            },
            {
              content: "...",
              role: "assistant" as MessageRole,
              createdAt: new Date(),
              image: "",
            },
          ].map((ele, i) => (
            <MessageBox key={i} index={i} message={ele} pfpUrl="" />
          ))}
        </div>
      </div>

      <ChatInputBox
        buttonRef={buttonRef}
        pending={pending}
        action={action}
        prompt={prompt}
        setPrompt={setPrompt}
        imageBase64={imageBase64}
      />
    </section>
  ) : (
    <section className="flex flex-col gap-2 w-full h-[calc(100vh-65px)] items-center justify-center">
      {/* Header */}
      <div className="flex flex-col items-center justify-center -mt-28">
        <div className="text-center mb-4">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-100 dark:bg-dark-4 rounded-full">
              <Bot className="w-8 h-8" />
            </div>
          </div>
          <h2 className="font-ubuntu font-bold text-3xl sm:text-4xl text-gray-900 dark:text-white mb-1">
            What can I help with?
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Ask anything about medical or upload your medical report
          </p>
        </div>
        <ChatInputBox
          onSubmit={() => {
            setUserPrompt(prompt);
            setPrompt("");
            setIsSubmitted(true);
          }}
          buttonRef={buttonRef}
          pending={pending}
          action={action}
          prompt={prompt}
          setPrompt={setPrompt}
          imageBase64={imageBase64}
          additionalInputElement={
            <>
              <input name="userId" type="text" value={userId} readOnly hidden />
              <input
                ref={imageUploaderRef}
                type="file"
                name="image"
                id="imageUpload"
                accept="image/*"
                hidden
                onChange={handleFileChange}
              />
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="absolute right-16 bottom-3 bg-light-4 dark:bg-dark-3 w-9 h-9 flex items-center justify-center text-white rounded-full shadow-light dark:shadow-dark">
                    <label
                      htmlFor="imageUpload"
                      aria-label="Upload Report"
                      className="cursor-pointer w-full h-full flex justify-center items-center"
                    >
                      <Camera size={24} />
                    </label>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">Upload Image</TooltipContent>
              </Tooltip>
              {imageBase64 && (
                <button
                  disabled={pending}
                  onClick={() => {
                    imageUploaderRef.current!.value = "";
                    setImageBase64("");
                  }}
                  className="absolute bottom-2 right-29 w-10 h-10 flex items-center object-cover overflow-hidden cursor-pointer"
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="w-full h-full">
                        <X className="absolute text-black w-full h-full opacity-0 hover:opacity-50" />
                        <img
                          key={imageBase64}
                          src={imageBase64}
                          alt="uploaded image"
                        />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">Cancel Image</TooltipContent>
                  </Tooltip>
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
        <div className="w-full md:w-4/6 flex flex-wrap items-center justify-center">
          {defaultMedicalQuestions.map((ele, index) => (
            <div
              key={index}
              onClick={() => {
                if (pending) return;
                submitOnDefaultQuestionsClick.current =
                  !submitOnDefaultQuestionsClick.current;
                setUserPrompt(ele);
                setPrompt(ele);
              }}
              className={`bg-white dark:bg-dark-4 shadow-dark dark:shadow-light p-2 py-1 mx-2 my-1 text-sm lg:text-base rounded-lg ${
                pending
                  ? "cursor-not-allowed"
                  : " cursor-pointer hover:bg-light-4 hover:text-white hover:dark:bg-white hover:dark:text-black hover:-translate-y-0.5"
              }`}
            >
              {ele}
            </div>
          ))}
        </div>
        {state?.message && <p className="text-red-400">{state?.message}</p>}
      </div>
    </section>
  );
}
