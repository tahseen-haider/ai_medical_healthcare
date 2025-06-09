"use client";

import { useState } from "react";
import ChatSection from "./ChatSection";
import ChatSidebar from "./ChatSidebar";
import { FilePenLine, Menu } from "lucide-react";

export default function ChatPage() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
    <section className="w-full max-w-[1920px] h-[calc(100vh-64px)] min-h-52 flex">
      {/* For backdrop blur */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="absolute top-0 left-0 lg:hidden h-full w-full backdrop-blur-sm z-10"
        />
      )}
      {/* Sidebar */}

      <ChatSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />

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
        <button className="p-2">
          <FilePenLine />
        </button>
      </div>

      {/* Seperator */}
      <div
        className={`${
          isSidebarOpen ? "w-80" : "w-0"
        } absolute lg:relative transition-all`}
      ></div>

      {/* Chat */}
      <div className="flex-1 ">
        <ChatSection />
      </div>
    </section>
  );
}
