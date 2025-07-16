"use client";

import React, { useState } from "react";
import { Loader2, MailPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { sendAppointmentMessage } from "@/actions";

export default function SendNewAppointmentMessage({
  userId,
}: {
  userId: string;
}) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [open, setOpen] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true)
    await sendAppointmentMessage({ userId, title, message });
    setSending(false)
    setTitle("");
    setMessage("");
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <MailPlus className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-gray-50 dark:bg-gray-950">
        <form onSubmit={handleSubmit} className="space-y-3">
          <h3 className="text-lg font-semibold">Send Message</h3>
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <Textarea
            placeholder="Message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          />
          <Button type="submit" className="w-full">
            {sending?<Loader2 className="animate-spin"/>:<div>Send</div>}
          </Button>
        </form>
      </PopoverContent>
    </Popover>
  );
}
