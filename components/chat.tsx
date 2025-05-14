"use client";

import Messages from "./messages";
import { Badge } from "./ui/badge";
import { useChat } from "@ai-sdk/react";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { CornerDownLeft } from "lucide-react";

type Props = {
  reportData: string;
};

export default function ChatComponent({ reportData }: Props) {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const isThinking =
    messages.length > 0 &&
    messages[messages.length - 1].role === "assistant" &&
    !messages[messages.length - 1].content?.trim();

  return (
    <div className="h-full bg-muted/50 relative flex flex-col min-h-[50vh] rounded-xl p-4 gap-4">
      <Badge
        variant={"outline"}
        className={`absolute right-3 top-1.5 ${reportData && "bg-[#00B612]"}`}
      >
        {reportData ? "✓ Report Added" : "No Report Added"}
      </Badge>
      <div className="flex-1"></div>
      <Messages messages={messages} />

      {/* <Accordion type="single" className="text-sm" collapsible>
        <AccordionItem value="item-1">
            <AccordionTrigger>
                <span className="flex flex-row items-center gap-2"><TextSearch/> Relevant Info</span>
            </AccordionTrigger>
            <AccordionContent className="whitespace-pre-wrap">
                
            </AccordionContent>
        </AccordionItem>
      </Accordion> */}

      <form
        onSubmit={(event) => {
          event.preventDefault();
          if(!input) return;
          handleSubmit(event, {
            data: {
              reportData: reportData as string,
            },
          });
          console.log('Submitted')
        }}
        className="relative overflow-hidden rounded-lg border bg-background"
      >
        <Textarea
          value={input}
          onChange={handleInputChange}
          placeholder="Type your query here..."
          className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
        />
        <div className="flex items-center p-3">
          <Button disabled={isThinking} className="ml-auto" size="sm" type="submit">
            <CornerDownLeft className="size-3.5" />
          </Button>
        </div>
      </form>
    </div>
  );
}
