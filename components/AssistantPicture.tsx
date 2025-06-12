import { Bot } from "lucide-react";

export default function AssistantPicture() {
  return (
    <div
      className={`rounded-full w-8 h-8 overflow-hidden shadow-[0_0_6px_rgba(0,0,0,0.4)] cursor-pointer bg-light-1 dark:bg-dark-4 border-2 text-black dark:text-white flex items-center justify-center`}
    >
      <Bot/>
    </div>
  );
}
