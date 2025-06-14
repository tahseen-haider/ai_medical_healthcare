"use client";

import MarkDown from "react-markdown";
import DOMPurify from "dompurify";
import { useMemo } from "react";
import { renderToString } from "react-dom/server";

export default function Markdown({ text }: { text: string }) {
  const secureHTML = useMemo(() => {
    const unsecure = renderToString(<MarkDown>{text}</MarkDown>);
    return DOMPurify.sanitize(unsecure);
  }, [text]);

  return (
    <div
      className="markdown-content"
      dangerouslySetInnerHTML={{ __html: secureHTML }}
    />
  );
}
