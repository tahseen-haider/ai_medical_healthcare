import { FilePenLine, Menu } from "lucide-react";
import React from "react";

export default function ChatSidebar({
  isSidebarOpen,
  setIsSidebarOpen,
}: {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div>
      {/* Menu buttons */}
      <div className="px-6 flex justify-between h-10 items-center border-b-2">
        <button
          className="p-2"
          onClick={() => {
            setIsSidebarOpen((prev) => !prev);
          }}
        >
          <Menu />
        </button>
        <button className="p-2">
          <FilePenLine />
        </button>
      </div>
      {/* Chats List */}
      <div className="flex flex-col pl-6 py-2 pr-2 gap-2 h-[calc(100vh-104px)] overflow-auto">
        <div className="h-10 w-full border-2 bg-light-2 dark:bg-dark-2 text-black dark:text-white rounded-lg flex items-center p-3 font-bold font-ubuntu ">
          Chat # 2: 5/26/2025
        </div>
      </div>
    </div>
  );
}
