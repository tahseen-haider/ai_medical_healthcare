"use client";

import React, { JSX } from "react";

interface MarkdownRendererProps {
  content: string;
}

type ListItem = { number: number; content: string };

export const Markdown: React.FC<MarkdownRendererProps> = ({ content }) => {
  const parseMarkdown = (text: string) => {
    const lines = text.split("\n");
    const elements: React.ReactNode[] = [];

    let listItems: ListItem[] = [];
    let isOrderedList = false;

    const flushList = () => {
      if (listItems.length === 0) return;
      const key = `list-${elements.length}`;

      const list = isOrderedList ? (
        // list-decimal ensures numbers are visible; pl-6 provides indentation
        <ol key={key} className="list-decimal pl-6 text-base space-y-1">
          {listItems.map((item, i) => (
            // value preserves the original numbering per-item
            <li key={`${key}-item-${i}`} value={item.number}>
              {parseInlineMarkdown(item.content)}
            </li>
          ))}
        </ol>
      ) : (
        <ul key={key} className="list-disc pl-6 text-base space-y-1">
          {listItems.map((item, i) => (
            <li key={`${key}-item-${i}`}>
              {parseInlineMarkdown(item.content)}
            </li>
          ))}
        </ul>
      );

      elements.push(list);
      listItems = [];
      isOrderedList = false;
    };

    const parseInlineMarkdown = (line: string): React.ReactNode => {
      let parts: React.ReactNode[] = [line]; // strictly ReactNode[]

      // Links [text](url)
      parts = parts.flatMap((chunk) => {
        if (typeof chunk !== "string") return [chunk];
        const result: React.ReactNode[] = [];
        let lastIndex = 0;
        const linkRegex = /\[([^\]]+)]\(([^)]+)\)/g;
        let match: RegExpExecArray | null;

        while ((match = linkRegex.exec(chunk)) !== null) {
          result.push(chunk.slice(lastIndex, match.index));
          result.push(
            <a
              key={`a-${lastIndex}`}
              href={match[2]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline text-base"
            >
              {match[1]}
            </a>
          );
          lastIndex = match.index + match[0].length;
        }

        result.push(chunk.slice(lastIndex));
        return result;
      });

      // Bold **text**
      parts = parts.flatMap((chunk) => {
        if (typeof chunk !== "string") return [chunk];
        return chunk.split(/(\*\*[^\*]+\*\*)/g).map((part, i) =>
          part.startsWith("**") && part.endsWith("**") ? (
            <strong key={`b-${i}`} className="font-semibold text-base">
              {part.slice(2, -2)}
            </strong>
          ) : (
            part
          )
        );
      });

      // Italic *text* or _text_
      parts = parts.flatMap((chunk) => {
        if (typeof chunk !== "string") return [chunk];
        return chunk.split(/(\*[^*]+\*|_[^_]+_)/g).map((part, i) => {
          if (
            (part.startsWith("*") && part.endsWith("*")) ||
            (part.startsWith("_") && part.endsWith("_"))
          ) {
            return (
              <em key={`i-${i}`} className="italic text-base">
                {part.slice(1, -1)}
              </em>
            );
          }
          return part;
        });
      });

      return <span className="text-base leading-snug">{parts}</span>;
    };

    lines.forEach((line, index) => {
      if (/^\s*$/.test(line)) {
        flushList();
        return;
      }

      // Headings (# to ####)
      const headingMatch = line.match(/^(#{1,4})\s+(.*)/);
      if (headingMatch) {
        flushList();
        const level = headingMatch[1].length;
        const content = headingMatch[2];
        const Tag = `h${level}` as keyof JSX.IntrinsicElements;
        const classNameMap: Record<number, string> = {
          1: "text-md font-bold mb-1",
          2: "text-sm font-bold mb-1",
          3: "text-md font-semibold mb-1",
          4: "text-md font-medium mb-1",
        };

        if (elements.length > 0) {
          elements.push(<br key={`br-${index}`} />);
        }
        elements.push(
          <Tag key={`h-${index}`} className={classNameMap[level]}>
            {parseInlineMarkdown(content)}
          </Tag>
        );

        return;
      }

      // Ordered List (preserve original numbers)
      if (/^\d+\.\s+/.test(line)) {
        const match = line.match(/^(\d+)\.\s+(.*)/);
        if (match) {
          const [, number, content] = match;
          if (!isOrderedList) flushList();
          isOrderedList = true;
          listItems.push({ number: parseInt(number, 10), content });
        }
        return;
      }

      // Unordered List (-)
      if (/^\-\s+/.test(line)) {
        const clean = line.replace(/^\-\s+/, "");
        if (isOrderedList) flushList();
        isOrderedList = false;
        // store same shape but number=0 for unordered items
        listItems.push({ number: 0, content: clean });
        return;
      }

      // Regular paragraph
      flushList();
      elements.push(
        <p key={`p-${index}`} className="text-base leading-snug">
          {parseInlineMarkdown(line)}
        </p>
      );
    });

    flushList();
    return elements;
  };

  return (
    <div className="text-base whitespace-pre-wrap break-words">
      {parseMarkdown(content)}
    </div>
  );
};
