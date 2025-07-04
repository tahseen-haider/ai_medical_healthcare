"use client"

import { Menu } from "lucide-react";
import React, { useLayoutEffect, useState } from "react";

export default function DashboardSidebarWrapper({children}: Readonly<{children: React.ReactNode}>) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  useLayoutEffect(() => {
    const isSmallScreen = window.innerWidth < 1024;
    setIsSidebarOpen(!isSmallScreen)
  }, [])
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
        } absolute top-14 sm:top-16 p-2 bg-white dark:bg-dark-4 opacity-90 hover:opacity-100 backdrop-blur-sm rounded-br-lg border-b-2 border-r-2 z-10 transition-all duration-300`}
      >
        <button
          className="p-2"
          onClick={() => {
            setIsSidebarOpen((prev) => !prev);
          }}
        >
          <Menu />
        </button>
      </div>

      {/* Seperator */}
      <div
        className={`${
          isSidebarOpen ? "w-54" : "w-0"
        } absolute lg:relative transition-all`}
      ></div>

      {/* Inside the Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "w-54 border-r-2" : "w-0"
        } absolute overflow-hidden z-20 bg-gray-50 dark:bg-dark-4 transition-all top-14 sm:top-16 `}
      >
        {/* Menu buttons */}
        <div className="px-6 flex justify-between h-10 items-center border-b-2 bg-white dark:bg-dark-4">
          <button
            className="p-2"
            onClick={() => {
              setIsSidebarOpen((prev) => !prev);
            }}
          >
            <Menu />
          </button>
        </div>
        {/* Chats List */}
        <div className="flex flex-col py-2 pr-2 gap-2 h-[calc(100vh-104px)] overflow-auto">
          {children}
        </div>
      </div>
    </>
  );
}
