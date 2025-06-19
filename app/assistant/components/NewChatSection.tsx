"use client";
import { useActionState, useState } from "react";
import { startNewChat } from "@/actions/chat.action";
import ChatInputBox from "./ChatInputBox";

export default function NewChatSection() {
  const [state, action, pending] = useActionState(startNewChat, undefined);
  const [prompt, setPrompt] = useState("");
  const [imageBase64, setImageBase64] = useState<string | undefined>();
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
  return (
    <section className="flex flex-col gap-4 w-full h-[calc(100vh-65px)] items-center justify-center">
      <h2 className="font-ubuntu text-4xl tracking-tight leading-12">
        What can I help with?
      </h2>
      <ChatInputBox
        pending={ pending}
        action={action}
        prompt={prompt}
        setPrompt={setPrompt}
        imageBase64={imageBase64}
        additionalInputElement={
          <>
            <input
              type="file"
              name="image"
              id="imageUpload"
              accept="image/*"
              hidden
              onChange={handleFileChange}
            />
            <input
              value={imageBase64 || ''}
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
