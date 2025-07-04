import React from "react";

export default function PopUpCard({
  children,
  setState,
}: Readonly<{
  children: React.ReactNode;
  setState?: React.Dispatch<React.SetStateAction<boolean>>;
}>) {
  return (
    <div
      className="fixed inset-0 z-30 flex justify-center items-center w-full h-full backdrop-blur-xs"
      onClick={() => {
        setState!(false)
      }}
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className=" rounded-2xl bg-light-1 dark:bg-dark-4 shadow-light dark:shadow-dark text-black dark:text-white 
      flex flex-col gap-6 items-center justify-between p-6"
      >
        {children}
      </div>
    </div>
  );
}
