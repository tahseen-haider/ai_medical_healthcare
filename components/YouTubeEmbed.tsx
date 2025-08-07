"use client";
import { useState } from "react";

type Props = {
  videoId: string;
};

export default function LazyYouTubeEmbed({ videoId }: Props) {
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);

  const thumbnail = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;

  return (
    <div
      className="aspect-video w-full relative rounded-lg overflow-hidden cursor-pointer"
      onClick={() => setIsPlayerVisible(true)}
    >
      {isPlayerVisible ? (
        <iframe
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          sandbox="allow-same-origin allow-scripts allow-presentation"
          title={`YouTube video player: ${videoId}`}
          src={`https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full border-none"
        />
      ) : (
        <>
          <img
            src={thumbnail}
            alt="YouTube thumbnail"
            className="w-full h-full object-cover"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="white"
              viewBox="0 0 24 24"
              width="64"
              height="64"
              className="drop-shadow-xl"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </>
      )}
    </div>
  );
}
