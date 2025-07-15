"use client";

import { FilePenLine, Menu } from "lucide-react";
import Link from "next/link";
import React, { useLayoutEffect, useState } from "react";

export default function ChatSidebarWrapper({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useLayoutEffect(() => {
    const isSmallScreen = window.innerWidth < 1024;
    setIsSidebarOpen(!isSmallScreen);
    setMounted(true);
  }, []);

  // Optionally show a skeleton or empty div with same structure
  if (!mounted) {
    return <div aria-hidden="true" className="w-0" />;
  }

  return (
    <>
      {/* Backdrop */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="absolute top-0 left-0 lg:hidden h-full w-full backdrop-blur-sm z-10"
        />
      )}

      {/* Menu Toggle Buttons */}
      <div
        className={`${
          isSidebarOpen ? "-left-42" : "left-0"
        } absolute top-14 sm:top-16  p-2 bg-white dark:bg-dark-4 opacity-90 hover:opacity-100 backdrop-blur-sm flex flex-col gap-4 rounded-br-lg justify-between items-center border-b-2 border-r-2 z-10 transition-all duration-300`}
      >
        <button
          className="p-2"
          onClick={() => setIsSidebarOpen((prev) => !prev)}
        >
          <Menu />
        </button>
        <Link className="p-2" href={"/assistant"}>
          <FilePenLine />
        </Link>
      </div>

      {/* Sidebar Spacer */}
      <div
        className={`${
          isSidebarOpen ? "w-80" : "w-0"
        } absolute lg:relative transition-all`}
      ></div>

      {/* Sidebar Panel */}
      <div
        className={`${
          isSidebarOpen ? "w-80 border-r-2" : "w-0"
        } absolute overflow-hidden z-20 bg-gray-50 dark:bg-gray-950 transition-all top-14 sm:top-16 `}
      >
        {/* Top Buttons */}
        <div className="px-6 flex justify-between h-10 items-center border-b-2 bg-white dark:bg-dark-4">
          <button
            className="p-2"
            onClick={() => setIsSidebarOpen((prev) => !prev)}
          >
            <Menu />
          </button>
          <Link className="p-2" href={"/assistant"}>
            <FilePenLine />
          </Link>
        </div>

        {/* Chat Content */}
        <div className="flex flex-col pl-2 py-4 pb-9 pr-2 gap-1 h-[calc(100vh-104px)] overflow-auto">
          {children}
        </div>
      </div>
    </>
  );
}
