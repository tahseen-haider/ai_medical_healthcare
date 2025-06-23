import React from "react";

export default function PopUpCard({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="fixed top-0 z-50 flex justify-center items-center w-full h-full backdrop-blur-xs">
      <div
        className=" rounded-2xl bg-light-1 dark:bg-dark-1 shadow-light dark:shadow-dark text-black dark:text-white 
      flex flex-col gap-6 items-center justify-between p-6"
      >
        {children}
      </div>
    </div>
  );
}
