import React from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AppointmentMessage } from "@/lib/definitions";

export default function AppointmentChatContent({
  receivedMessages,
  sentMessages,
}: {
  receivedMessages: AppointmentMessage;
  sentMessages: AppointmentMessage;
}) {
  const renderMessages = (messages: AppointmentMessage, type: "sent" | "received") => {
    if (!messages || messages.length === 0) {
      return (
        <div className="p-6 text-center text-gray-500">
          No {type === "sent" ? "sent" : "received"} messages.
        </div>
      );
    }

    return (
      <div className="grid gap-4 p-2">
        {messages.map((message) => (
          <Card key={message.id} className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>{message.title.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-base">{message.title}</CardTitle>
                  <CardDescription className="text-xs">
                    {new Date(message.createdAt).toLocaleString()}
                  </CardDescription>
                </div>
              </div>
              <Badge variant={message.is_read ? "default" : "secondary"}>
                {message.is_read ? "Read" : "Unread"}
              </Badge>
            </CardHeader>
            <CardContent className="pt-2 text-sm text-gray-800">
              {message.content}
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <Tabs defaultValue="received" className="w-full">
      <TabsList className="mb-4 w-full justify-center">
        <TabsTrigger value="received" className="w-1/2">
          Received
        </TabsTrigger>
        <TabsTrigger value="sent" className="w-1/2">
          Sent
        </TabsTrigger>
      </TabsList>

      <TabsContent value="received">{renderMessages(receivedMessages, "received")}</TabsContent>
      <TabsContent value="sent">{renderMessages(sentMessages, "sent")}</TabsContent>
    </Tabs>
  );
}
