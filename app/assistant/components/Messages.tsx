"use client";

import React, {
  useActionState,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import MessageBox from "./MessageBox";
import { usePathname } from "next/navigation";
import ChatInputBox from "./ChatInputBox";
import { $Enums } from "@prisma/client/edge";
import { v4 as uuidv4 } from "uuid";
import { deleteImageFromCloudinary } from "@/actions/chat.action";
import { Camera, X } from "lucide-react";
import { UserType } from "@/lib/definitions";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function Messages({
  userData,
  initialMessages,
  pfpUrl,
}: {
  userData: UserType;
  initialMessages: {
    content: string;
    chatId: string;
    id: string;
    role: $Enums.MessageRole;
    createdAt: Date;
    image: string | null;
  }[];
  pfpUrl?: string;
}) {
  const pathname = usePathname();
  const chatId = pathname.split("/assistant/")[1];

  const [ImageDeletededState, deleteImageAction, pendingImageDeleting] =
    useActionState(deleteImageFromCloudinary, {});

  // States
  const [messages, setMessages] = useState(
    initialMessages.map(({ id, content, role, createdAt, image }) => ({
      id,
      content,
      role,
      createdAt,
      image,
    }))
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImgID, setUploadedImgID] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | undefined>();
  const [prompt, setPrompt] = useState("");

  const uploadImageFormRef = useRef<HTMLFormElement>(null);

  const uploadToCloudinary = async (file: File) => {
    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET as string
      );

      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dydu5o7ny/image/upload",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!res.ok) {
        setIsUploading(false);
      }

      const data = await res.json();
      setIsUploading(false);

      // Cloudinary returns `public_id` in JSON
      return data.public_id;
    } catch (err) {
      console.error(err);
      setIsUploading(false);
      return null;
    }
  };

  // Refs
  const imageUploaderRef = useRef<HTMLInputElement | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  const randomId = () => uuidv4();

  // Scroll to bottom on new messages
  useLayoutEffect(() => {
    const timeout = setTimeout(() => {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
    return () => clearTimeout(timeout);
  }, [messages]);

  // Server Sent Event Declaration
  const streamGPTMessage = ({
    userData,
    chatId,
    message,
    public_id,
    onData,
    onDone,
    isOldMessage,
  }: {
    userData: UserType;
    isOldMessage: boolean;
    chatId: string;
    message?: string;
    public_id?: string;
    onData: (token: string) => void;
    onDone: () => void;
  }) => {
    const params = new URLSearchParams({
      chatId,
      isOldMessage: isOldMessage.toString(),
      userId: userData.id,
      username: userData.name,
      dob: userData.dob || "",
      bloodType: userData.bloodType || "",
      allergies: userData.allergies?.join(",") || "",
      gender: userData.gender || "",
      chronicConditions: userData.chronicConditions?.join(",") || "",
      medication: userData.medications?.join(",") || "",
      surgeries: userData.surgeries?.join(",") || "",
      immunizations: userData.immunizations?.join(",") || "",
      bloodPressure: userData.bloodPressure || "",
      heartRate: userData.heartRate?.toString() || "",
      respiratoryRate: userData.respiratoryRate?.toString() || "",
      temperature: userData.temperature?.toString() || "",
      smoker: userData.smoker?.toString() || "",
      alcoholUse: userData.alcoholUse?.toString() || "",
      exerciseFrequency: userData.exerciseFrequency || "",
      mentalHealthConcerns: userData.mentalHealthConcerns?.join(",") || "",
      notes: userData.notes || "",
      height: userData.height?.toString() || "",
      weight: userData.weight?.toString() || "",
      lastCheckUp: userData.lastCheckUp?.toISOString() || "",
    });

    if (message) params.set("message", message);
    if (public_id) params.set("public_id", public_id);

    const eventSource = new EventSource(`/api/stream-gpt?${params.toString()}`);

    eventSource.onmessage = (event) => {
      const { token } = JSON.parse(event.data);
      const cleanedToken = token.replace(/\n+/g, "\n");
      onData(cleanedToken);
    };

    eventSource.addEventListener("done", () => {
      onDone();
      eventSource.close();
    });
    eventSource.addEventListener("error", (event) => {
      const messageEvent = event as MessageEvent;
      try {
        const parsed = JSON.parse(messageEvent.data);

        onData(parsed.error);
      } catch (e) {
        console.error("Failed to parse event data", e);
        onData(
          "Something went wrong while generating your response. Kindly contact us for inquiry."
        );
      }

      setIsGenerating(false);
      eventSource.close();
    });
  };

  // If last message is not answered run this
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage.role === "user" && !isGenerating) {
      setMessages((prev) => [
        ...prev,
        {
          id: randomId(),
          createdAt: new Date(Date.now()),
          image: null,
          role: "assistant",
          content: "",
        },
      ]);
      setIsGenerating(true);

      streamGPTMessage({
        userData,
        isOldMessage: true,
        chatId,
        message: lastMessage.content,
        public_id: lastMessage.image || undefined,
        onData: (token) => {
          setMessages((prev) => {
            const last = prev[prev.length - 1];
            const updatedLast = {
              ...last,
              content: last.content + token,
            };
            return [...prev.slice(0, -1), updatedLast];
          });
        },
        onDone: () => setIsGenerating(false),
      });
    }
  }, []);

  return (
    <section className="flex flex-col items-center">
      <div className="w-full h-[calc(100vh-65px-120px)] overflow-y-auto">
        <div className="w-full mx-auto flex flex-col pb-20">
          <div className="w-4/5 mx-auto flex justify-center mt-4 gap-2 flex-col text-center pb-12">
            <h1 className="font-bold font-ubuntu text-3xl">MediTech</h1>
            <p className="text-gray-500 leading-4">
              Ask anything about medical or upload your medical report
            </p>
          </div>
          {/* Messages */}
          {messages.map((ele, i) => (
            <MessageBox key={i} index={i} message={ele} pfpUrl={pfpUrl} />
          ))}
        </div>
        <div ref={bottomRef} />
      </div>
      {/* Chat Input */}
      <ChatInputBox
        buttonRef={buttonRef}
        imageBase64={imageBase64}
        onSubmit={(e) => {
          e.preventDefault();

          if (!imageBase64 && !prompt) return;

          setMessages((prev) => [
            ...prev,
            {
              id: randomId(),
              content: prompt || "Image Uploaded!",
              role: "user",
              createdAt: new Date(),
              image: uploadedImgID,
            },
          ]);

          streamGPTMessage({
            userData,
            isOldMessage: false,
            chatId,
            message: prompt,
            public_id: uploadedImgID || undefined,
            onData: (token) => {
              setMessages((prev) => {
                const last = prev[prev.length - 1];
                if (last?.role !== "assistant") {
                  return [
                    ...prev,
                    {
                      id: randomId(),
                      content: token,
                      role: "assistant",
                      createdAt: new Date(),
                      image: null,
                    },
                  ];
                }

                // Otherwise, append to last
                const updatedLast = {
                  ...last,
                  content: last.content + token,
                };
                return [...prev.slice(0, -1), updatedLast];
              });
            },
            onDone: () => setIsGenerating(false),
          });
          setImageBase64("");
          setUploadedImgID("");
          setPrompt("");
          setIsGenerating(true);
        }}
        prompt={prompt}
        setPrompt={setPrompt}
        pending={isGenerating || isUploading || pendingImageDeleting}
        additionalInputElement={
          <>
            <input type="text" name="chatId" readOnly hidden value={chatId} />
          </>
        }
        additionalFormsElements={
          <>
            {/* Image Uploader Form */}
            <form
              ref={uploadImageFormRef}
              className="absolute right-16 bottom-3 flex gap-4"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                ref={imageUploaderRef}
                type="file"
                name="image"
                id="imageUpload"
                accept="image/*"
                hidden
                onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                  setIsUploading(true);
                  const file = e.target.files?.[0];
                  if (!file) return;

                  const reader = new FileReader();
                  reader.onloadend = async () => {
                    const base64 = reader.result as string;
                    setImageBase64(base64);
                    const public_image_id = await uploadToCloudinary(file);
                    setUploadedImgID(public_image_id);
                    setIsUploading(false);
                  };
                  reader.readAsDataURL(file);
                }}
                disabled={isGenerating || isUploading || pendingImageDeleting}
              />
              <input type="text" name="chatId" readOnly hidden value={chatId} />
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="bg-light-4 dark:bg-dark-3 w-9 h-9 flex items-center justify-center text-white rounded-full relative shadow-light dark:shadow-dark">
                    <label
                      htmlFor="imageUpload"
                      aria-label="Upload Report"
                      className="cursor-pointer w-9 h-9 flex justify-center items-center"
                    >
                      <Camera size={24} />
                    </label>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="bottom">Upload Image</TooltipContent>
              </Tooltip>
            </form>
            {/* Cancel Image Form */}
            {imageBase64 && (
              <form
                action={deleteImageAction}
                onSubmit={() => {
                  if (isUploading) return;
                  if (imageUploaderRef.current)
                    imageUploaderRef.current.value = "";
                  setImageBase64("");
                }}
                className="absolute bottom-2 right-30"
              >
                <input
                  type="text"
                  name="public_image_id"
                  value={uploadedImgID || ""}
                  hidden
                  readOnly
                />
                <button
                  type="submit"
                  className="relative w-10 h-10 flex items-center object-cover overflow-hidden cursor-pointer"
                  disabled={isGenerating || isUploading || pendingImageDeleting}
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
              </form>
            )}
          </>
        }
      />
    </section>
  );
}
