"use client";

import { marked } from "marked";
import DOMPurify from "dompurify";
import { useEffect, useMemo, useState } from "react";

export default function Markdown({ text }: { text: string }) {
  const [secureHTML, setSecureHTML] = useState("");

  useEffect(() => {
    async function parseAndSanitize() {
      const rawHTML = await marked.parse(text); // Await the async markdown parsing
      const cleanHTML = DOMPurify.sanitize(rawHTML); // Sanitize the HTML string
      setSecureHTML(cleanHTML); // Store in state
    }

    parseAndSanitize();
  }, [text]);

  return (
    <div
      className="markdown-content"
      dangerouslySetInnerHTML={{ __html: secureHTML }}
    />
  );
}
