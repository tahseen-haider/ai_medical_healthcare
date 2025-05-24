import React from "react";

export default function YouTubeEmbed({ videoId }: { videoId: string }) {
  return (
    <div className="aspect-video w-full">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}`}
        allow="accelerometer; autoplay; clipboard-writer; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className="w-full h-full rounded-lg shadow-light dark:shadow-dark"
      ></iframe>
    </div>
  );
}
