"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { LucideMailOpen, MailCheck, Trash2 } from "lucide-react";
import { Badge } from "./ui/badge";
import {
  deleteAppointmentSentMessage,
  markReadAppointmentMessage,
} from "@/actions";

type AppointmentMessageItem = {
  senderId: string;
  receiverId: string;
  appointmentId: string;
  is_read: boolean;
  id: string;
  createdAt: Date;
  title: string;
  content: string;
};

type AppointmentMessage = AppointmentMessageItem[];

function formatMessage(
  message: string,
  light: string,
  dark: string
): React.ReactNode[] {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  const regex = /"([^"]*)"/g;
  let match;
  while ((match = regex.exec(message)) !== null) {
    if (match.index > lastIndex) {
      parts.push(message.substring(lastIndex, match.index));
    }
    parts.push(
      <strong
        key={match.index}
        className={`font-semibold ${light} dark:${dark}`}
      >
        {match[1]}
      </strong>
    );
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < message.length) {
    parts.push(message.substring(lastIndex));
  }
  return parts;
}

export default function AppointmentChatContent({
  receivedMessages,
  sentMessages,
}: {
  receivedMessages: AppointmentMessage | undefined;
  sentMessages: AppointmentMessage | undefined;
}) {
  const [localReceivedMessages, setLocalReceivedMessages] =
    useState<AppointmentMessage>(receivedMessages || []);
  const [localSentMessages, setLocalSentMessages] =
    useState<AppointmentMessage>(sentMessages || []);

  // Update local state when props change
  useEffect(() => {
    setLocalReceivedMessages(receivedMessages || []);
  }, [receivedMessages]);

  useEffect(() => {
    setLocalSentMessages(sentMessages || []);
  }, [sentMessages]);

  // Handlers

  const handleMarkAsRead = async (id: string, type: "sent" | "received") => {
    if (type === "received") {
      setLocalReceivedMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, is_read: true } : m))
      );
      await markReadAppointmentMessage(id);
    }
  };

  const handleDelete = async (id: string, type: "sent" | "received") => {
    if (type === "sent") {
      setLocalSentMessages((prev) => prev.filter((m) => m.id !== id));
      await deleteAppointmentSentMessage(id);
    }
  };

  // Messages Renderer
  const renderMessages = (
    messages: AppointmentMessage,
    type: "sent" | "received"
  ) => {
    if (!messages || messages.length === 0) {
      return (
        <div className="p-6 text-center text-gray-500 h-64">
          No {type === "sent" ? "sent" : "received"} messages.
        </div>
      );
    }

    // Sort by read status (unread first), then by createdAt (newest first)
    const sortedMessages = [...messages].sort((a, b) => {
      if (a.is_read !== b.is_read) {
        return a.is_read ? 1 : -1; // Unread (false) comes before read (true)
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(); // Newest first
    });

    return (
      <ScrollArea className="h-64 px-2 py-2">
        <div className="grid gap-2 ">
          {sortedMessages.map((message) => (
            <div
              key={message.id}
              className={`relative p-2 border-b flex items-start gap-3 rounded bg-transparent transition ${
                message.is_read ? "" : "bg-accent text-black dark:text-white"
              }`}
            >
              {!message.is_read && type === "received" && (
                <div
                  className={`min-h-2 min-w-2 rounded-full mt-2 bg-blue-500 dark:bg-white`}
                />
              )}
              {message.is_read && <div />}

              <div className="flex-grow">
                <div className="flex align-middle gap-4 flex-1 justify-between">
                  <p
                    className={`text-md max-w-48 underline underline-offset-3 font-medium ${
                      message.is_read
                        ? "text-muted-foreground"
                        : "text-foreground"
                    }`}
                  >
                    {message.title}
                  </p>
                  {!message.is_read && type === "sent" && (
                    <Badge className="h-fit">
                      {!message.is_read ? "Unread" : "read"}
                    </Badge>
                  )}
                </div>
                <p
                  className={`text-sm ${
                    message.is_read
                      ? "text-muted-foreground"
                      : "text-foreground"
                  }`}
                >
                  {message.is_read
                    ? formatMessage(
                        message.content,
                        "text-gray-500",
                        "text-gray-400"
                      )
                    : formatMessage(
                        message.content,
                        "text-green-700",
                        "text-green-200"
                      )}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(message.createdAt).toLocaleString()}
                </p>
              </div>
              <div className="flex flex-col gap-1 z-20 items-center">
                {type === "received" && (
                  <>
                    {message.is_read ? (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {}}
                        className="hover:opacity-100"
                      >
                        <LucideMailOpen className="w-4 h-4" />
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleMarkAsRead(message.id, type)}
                        className="hover:opacity-100"
                      >
                        <MailCheck className="w-4 h-4" />
                      </Button>
                    )}
                  </>
                )}
                {type === "sent" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(message.id, type)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    );
  };

  return (
    <Tabs defaultValue="received" className="w-full p-2">
      <TabsList className="w-full flex justify-center bg-transparent border-b-2 py-0 rounded-none">
        <TabsTrigger value="received" className="w-1/2 py-2 text-center">
          Received
        </TabsTrigger>
        <TabsTrigger value="sent" className="w-1/2 py-2 text-center">
          Sent
        </TabsTrigger>
      </TabsList>
      <TabsContent className="" value="received">
        {renderMessages(localReceivedMessages, "received")}
      </TabsContent>
      <TabsContent className="" value="sent">
        {renderMessages(localSentMessages, "sent")}
      </TabsContent>
    </Tabs>
  );
}
