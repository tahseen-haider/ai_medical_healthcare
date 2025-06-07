import React from "react";

const LoadingScreen = (props: { message?: string }) => {
  return (
    <div className="fixed top-0 z-50 flex flex-col items-center justify-center h-screen w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-xs text-gray-800 dark:text-white">
      <video 
        autoPlay 
        loop 
        muted 
        playsInline
        className="w-40 h-40 bg-transparent"
        preload="auto"
      >
        <source 
          src="/videos/MediTech_LOGO.webm" 
          type="video/webm" 
        />
        Your browser does not support the video tag.
      </video>
      <p className="text-lg font-semibold">{props.message || "Loading..."}</p>
    </div>
  );
};

export default LoadingScreen;