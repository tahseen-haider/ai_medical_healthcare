import { FilePenLine, Menu } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";
import ChatsList from "./ChatsList";

export default function ChatSidebar({
  isSidebarOpen,
  setIsSidebarOpen,
}: {
  isSidebarOpen: boolean;
  setIsSidebarOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <>
      {/* For backdrop blur */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="absolute top-0 left-0 lg:hidden h-full w-full backdrop-blur-sm z-10"
        />
      )}

      {/* Menu Buttons */}
      <div
        className={`${
          isSidebarOpen ? "-left-42" : "left-0"
        } absolute p-2  bg-light-1 dark:bg-dark-4 flex flex-col gap-4 rounded-br-lg justify-between items-center border-b-2 border-r-2 z-10 transition-all duration-300`}
      >
        <button
          className="p-2"
          onClick={() => {
            setIsSidebarOpen((prev) => !prev);
          }}
        >
          <Menu />
        </button>
        <Link className="p-2" href={"/assistant"}>
          <FilePenLine />
        </Link>
      </div>

      {/* Seperator */}
      <div
        className={`${
          isSidebarOpen ? "w-80" : "w-0"
        } absolute lg:relative transition-all`}
      ></div>

      {/* Inside the Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "w-80 border-r-2" : "w-0"
        } absolute overflow-hidden z-20 bg-light-1 dark:bg-dark-4 transition-all`}
      >
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
          <Link className="p-2" href={"/assistant"}>
            <FilePenLine />
          </Link>
        </div>
        {/* Chats List */}
        <div className="flex flex-col pl-6 py-2 pr-2 gap-2 h-[calc(100vh-104px)] overflow-auto">
          <Suspense fallback={<p>Loading...</p>}>
            <ChatsList />
          </Suspense>
        </div>
      </div>
    </>
  );
}
