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
    console.log(imageBase64);
  }, [imageBase64]);
  return (
    <section className="flex flex-col gap-4 w-full h-[calc(100vh-65px)] items-center justify-center">
      <h2 className="font-ubuntu text-4xl tracking-tight leading-12">
        What can I help with?
      </h2>
      <ChatInputBox
        onCancelImg={() => {
          setImageBase64("");
          if (imageUploaderRef.current) imageUploaderRef.current.value = "";
        }}
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
      {state?.message && <p className="text-red-400">{state?.message}</p>}
    </section>
  );
}
