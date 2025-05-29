import React from "react";

const LoadingScreen = (props: {message: string}) => {
  return (
    <div className="fixed top-0 z-50 flex flex-col items-center justify-center h-screen w-full bg-white/50 dark:bg-gray-900/50 backdrop-blur-xs text-gray-800 dark:text-white">
      <svg
        className="animate-spin h-10 w-10 text-blue-500 mb-4"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        ></circle>
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8H4z"
        ></path>
      </svg>
      <p className="text-lg font-semibold">{props.message || "Loading..."}</p>
    </div>
  );
};

export default LoadingScreen;
