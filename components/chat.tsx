"use client";

import Messages from "./messages";
import { Badge } from "./ui/badge";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { CornerDownLeft } from "lucide-react";

type Props = {
  reportData: string;
};

export default function ChatComponent({ reportData }: Props) {
  // const { messages, input, handleInputChange, handleSubmit } = useChat();
  return (
    <div className="h-full bg-muted/50 relative flex flex-col min-h-[50vh] rounded-xl p-4 gap-4">
      <Badge
        variant={"outline"}
        className={`absolute right-3 top-1.5 ${reportData && "bg-[#00B612]"}`}
      >
        {reportData ? "✓ Report Added" : "No Report Added"}
      </Badge>
      <div className="flex-1"></div>
      {/* <Messages messages={messages} /> */}

      <form
        onSubmit={(event) => {
          event.preventDefault();
          console.log('Submitted')
        }}
        className="relative overflow-hidden rounded-lg border bg-background"
      >
        <Textarea
          placeholder="Type your query here..."
          className="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
        />
        <div className="flex items-center p-3">
          <Button className="ml-auto" size="sm" type="submit">
            <CornerDownLeft className="size-3.5" />
          </Button>
        </div>
      </form>
    </div>
  );
}
