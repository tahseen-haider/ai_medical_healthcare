import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Mail } from "lucide-react";
import React, { useState } from "react";
import AppointmentChatContent from "./AppointmentChatContent";

export default function ChatAppointment({
  appData,
}: {
  appData: {
    userId: string | undefined;
    appointmentId: string;
    hasUnread: boolean
  };
}) {

  const [open, setOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);

  const handleOpenChange = (state: boolean) => {
    setOpen(state);
    if (state && !hasOpened) {
      setHasOpened(true);
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button className="relative" variant="outline" size="icon">
          <Mail className="h-4 w-4" />
          {/* Badge */}
          {(appData.hasUnread && !hasOpened) && (
            <span className="absolute top-0 right-0 inline-flex h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-gray-900" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-gray-50 dark:bg-gray-950 p-0">
        <AppointmentChatContent appData={appData}/>
      </PopoverContent>
    </Popover>
  );
}
