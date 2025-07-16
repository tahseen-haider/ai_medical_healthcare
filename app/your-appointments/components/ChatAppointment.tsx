import { getAppointmentMessagesOfSenderReceiver } from "@/actions";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Mail } from "lucide-react";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

type Message =
  | {
      senderId: string;
      receiverId: string;
      appointmentId: string;
      is_read: boolean;
      id: string;
      createdAt: Date;
      title: string;
      content: string;
    }[]
  | undefined;

export default function ChatAppointment({
  appData,
}: {
  appData: {
    senderId: string | undefined;
    receiverId: string | undefined;
    appointmentId: string;
  };
}) {
  const { senderId, receiverId, appointmentId } = appData;

  const { data } = useSWR(
    receiverId ? "notification-" + receiverId : null,
    () =>
      getAppointmentMessagesOfSenderReceiver(
        senderId,
        receiverId,
        appointmentId
      ),
    {
      refreshInterval: 60000,
      revalidateOnFocus: true,
      refreshWhenOffline: false,
      revalidateOnMount: true,
      shouldRetryOnError: true,
    }
  );

  const [receivedMessages, setReceivedMessages] = useState<Message>();
  const [sentMessages, setSentMessages] = useState<Message>();
  const [hasNewReceivedMessages, setHasNewReceivedMessages] =
    useState<boolean>(false);

  useEffect(() => {
    setReceivedMessages(data?.receivedMessages);
    setSentMessages(data?.sentMessages);
  }, [data?.receivedMessages, data?.sentMessages]);

  useEffect(() => {
    const unreadReceivedMessages = receivedMessages?.some(
      (message) => !message.is_read
    );
    setHasNewReceivedMessages(unreadReceivedMessages ?? false);
  }, [receivedMessages]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="relative" variant="outline" size="icon">
          <Mail className="h-4 w-4" />
          {/* Badge */}
          {hasNewReceivedMessages && (
            <span className="absolute top-0 right-0 inline-flex h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-gray-50 dark:bg-gray-950">
        <Tabs defaultValue="received">
          <TabsList>
            <TabsTrigger value="received">Received</TabsTrigger>
            <TabsTrigger value="sent">Sent</TabsTrigger>
          </TabsList>
          <TabsContent value="received">
            {receivedMessages && receivedMessages.length > 0 ? (
              <div className="space-y-2">
                {receivedMessages.map((message) => (
                  <div
                    key={message.id}
                    className="p-2 border-b border-gray-200"
                  >
                    <div className="font-semibold">{message.title}</div>
                    <div>{message.content}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(message.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-gray-500">No received messages</div>
            )}
          </TabsContent>
          <TabsContent value="sent">
            {sentMessages && sentMessages.length > 0 ? (
              <div className="space-y-2">
                {sentMessages.map((message) => (
                  <div
                    key={message.id}
                    className="p-2 border-b border-gray-200"
                  >
                    <div className="font-semibold">{message.title}</div>
                    <div>{message.content}</div>
                    <div className="text-sm text-gray-500">
                      {new Date(message.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-gray-500">No sent messages</div>
            )}
          </TabsContent>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
}
