import { getAppointmentMessagesOfSentReceived } from "@/actions";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { AppointmentMessage } from "@/lib/definitions";
import { Mail } from "lucide-react";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import AppointmentChatContent from "./AppointmentChatContent";

export default function userIdChatAppointment({
  appData,
}: {
  appData: {
    userId: string | undefined;
    appointmentId: string;
  };
}) {
  const { userId, appointmentId } = appData;

  const { data } = useSWR(
    userId ? "notification-" + appointmentId : null,
    () => getAppointmentMessagesOfSentReceived(userId, appointmentId),
    {
      refreshInterval: 60000,
      revalidateOnFocus: true,
      refreshWhenOffline: false,
      revalidateOnMount: true,
      shouldRetryOnError: true,
    }
  );

  const [receivedMessages, setReceivedMessages] = useState<AppointmentMessage>();
  const [sentMessages, setSentMessages] = useState<AppointmentMessage>();
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
      <PopoverContent className="w-80 bg-gray-50 dark:bg-gray-950 p-0">
        <AppointmentChatContent sentMessages={sentMessages} receivedMessages={receivedMessages}/>
      </PopoverContent>
    </Popover>
  );
}
