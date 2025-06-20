"use client";

import { marked } from "marked";
import DOMPurify from "dompurify";
import { useEffect, useState } from "react";

export default function Markdown({ text }: { text: string }) {
  const [secureHTML, setSecureHTML] = useState("");
  const [isMarkedDown, setIsMarkedDown] = useState(false);

  useEffect(() => {
    async function parseAndSanitize() {
      const rawHTML = await marked.parse(text); // Await the async markdown parsing
      const cleanHTML = DOMPurify.sanitize(rawHTML); // Sanitize the HTML string
      setIsMarkedDown(true)
      setSecureHTML(cleanHTML); // Store in state
    }

    parseAndSanitize();
  }, [text]);

  if(!isMarkedDown) return <div>Loading...</div>
  return (
    <div
      dangerouslySetInnerHTML={{ __html: secureHTML }}
    />
  );
}
