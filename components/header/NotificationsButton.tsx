"use client";
import { useEffect, useState } from "react";
import type React from "react";

import { Bell, LucideMail, LucideMailOpen, Trash2 } from "lucide-react";
import { type AppointmentStatus, NotificationType } from "@prisma/client/edge";
import type { NotificationItem, UserType } from "@/lib/definitions";
import {
  markNotificationAsRead,
  deleteNotification,
  markAllNotificationsAsRead,
  markNotificationAsUnread,
} from "@/actions";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import useSWR from "swr";

import { getUserNotifications } from "@/actions";

const fetcher = (userId: string) => getUserNotifications(userId);

function formatMessage(message: string): React.ReactNode[] {
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
        className="font-semibold text-green-800 dark:text-green-500"
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

export default function NotificationsComponent({ user }: { user: UserType }) {
  const {
    data: notifications,
    error,
    isLoading,
  } = useSWR(
    user?.id ? ["notifications", user.id] : null,
    () => fetcher(user.id),
    {
      refreshInterval: 60000,
      revalidateOnFocus: true,
    }
  );

  const [notifi, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    if (notifications) {
      setNotifications(notifications);
    }
  }, [notifications]);
  const handleMarkAsRead = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    await markNotificationAsRead(id);
  };

  const handleMarkAsUnread = async (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: false } : n))
    );
    await markNotificationAsUnread(id);
  };

  const handleDelete = async (id: string) => {
    await deleteNotification(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const unreadCount = notifi.filter((n) => !n.read).length;

  const getColor = (type: NotificationType, status?: AppointmentStatus) => {
    if (type === NotificationType.APPOINTMENT_UPDATE && status) {
      switch (status) {
        case "CONFIRMED":
          return "text-green-600 dark:text-green-400";
        case "PENDING":
          return "text-yellow-600 dark:text-yellow-400";
        case "CANCELLED":
          return "text-red-600 dark:text-red-400";
        case "RESCHEDULED":
          return "text-blue-600 dark:text-blue-400";
        case "PAYMENT_PENDING":
          return "text-orange-600 dark:text-orange-400";
      }
    }
    switch (type) {
      case "GENERAL_ANNOUNCEMENT":
        return "text-purple-600 dark:text-purple-400";
      case "PRESCRIPTION_REMINDER":
        return "text-teal-600 dark:text-teal-400";
      case "SYSTEM_ALERT":
        return "text-red-700 dark:text-red-500";
      default:
        return "text-gray-500 dark:text-gray-400";
    }
  };

  const filtered = (type: string) => {
    const filteredNotifications = notifi.filter((n) => {
      if (type === "appointments") return n.type === "APPOINTMENT_UPDATE";
      return [
        "GENERAL_ANNOUNCEMENT",
        "SYSTEM_ALERT",
        "PRESCRIPTION_REMINDER",
      ].includes(n.type);
    });

    // Sort by read status (unread first), then by createdAt (newest first)
    return filteredNotifications.sort((a, b) => {
      // Unread (false) comes before read (true)
      if (a.read !== b.read) {
        return a.read ? 1 : -1;
      }
      // If read status is the same, sort by createdAt descending (newest first)
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative bg-transparent"
        >
          <Bell className="w-4 h-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              {unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 p-0">
        <Card className="bg-gray-50 dark:bg-dark-2 py-4 gap-4">
          <CardHeader>
            <div className="flex justify-between gap-2">
              <div>
                <CardTitle>Notifications</CardTitle>
                <CardDescription className="text-gray-800 dark:text-gray-200">
                  {unreadCount} unread
                </CardDescription>
              </div>
              {notifi.length > 0 && (
                <div
                  className="cursor-pointer"
                  onClick={async () => {
                    setNotifications((prev) =>
                      prev.map((n) => ({ ...n, read: true }))
                    );
                    await markAllNotificationsAsRead(user!.id);
                  }}
                >
                  Mark All as Read
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="w-full p-0 text-gray-600 dark:text-gray-400">
            <Tabs defaultValue="appointments">
              <TabsList className="grid grid-cols-2 w-full bg-transparent border-b-2 py-0 rounded-none">
                <TabsTrigger
                  value="appointments"
                  className="rounded-xs text-gray-800 dark:text-gray-200"
                >
                  Appointments
                </TabsTrigger>
                <TabsTrigger
                  value="general"
                  className="rounded-xs text-gray-800 dark:text-gray-200"
                >
                  General
                </TabsTrigger>
              </TabsList>
              <TabsContent value="appointments">
                <ScrollArea className="h-72 px-2 py-2">
                  {filtered("appointments").length === 0 ? (
                    <p className="text-sm text-black dark:text-white">
                      No notifications.
                    </p>
                  ) : (
                    filtered("appointments").map((n) => (
                      <div
                        key={n.id}
                        className={`relative p-2 border-b flex items-start gap-3 rounded hover:bg-muted/30 transition ${
                          n.read ? "" : "bg-accent text-black dark:text-white"
                        }`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full mt-2 ${getColor(
                            n.type
                          )} bg-current`}
                        />
                        <div className="flex-grow">
                          <p className="text-sm font-medium">{n.title}</p>
                          <p className="text-sm">{formatMessage(n.message)}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(n.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex flex-col gap-1 z-20">
                          {n.read ? (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleMarkAsUnread(n.id)}
                              className="hover:opacity-100"
                            >
                              <LucideMailOpen className="w-4 h-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleMarkAsRead(n.id)}
                              className="hover:opacity-100"
                            >
                              <LucideMail className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(n.id)}
                            className="opacity-70 hover:opacity-100"
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </ScrollArea>
              </TabsContent>
              <TabsContent value="general">
                <ScrollArea className="h-72 px-2 py-2">
                  {filtered("general").length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No notifications.
                    </p>
                  ) : (
                    filtered("general").map((n) => (
                      <div
                        key={n.id}
                        className={`relative p-2 border-b flex items-start gap-3 rounded hover:bg-muted/30 transition ${
                          n.read
                            ? "opacity-60"
                            : "bg-accent text-black dark:text-white"
                        }`}
                      >
                        <span
                          className={`h-2 w-2 rounded-full mt-2 ${getColor(
                            n.type
                          )} bg-current`}
                        />
                        <div className="flex-grow">
                          <p className="text-sm font-medium">{n.title}</p>
                          <p className="text-sm text-gray-800 dark:text-gray-200">
                            {formatMessage(n.message)}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(n.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex flex-col gap-1">
                          {n.read ? (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleMarkAsUnread(n.id)}
                              className="hover:opacity-100"
                            >
                              <LucideMailOpen className="w-4 h-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleMarkAsRead(n.id)}
                              className="hover:opacity-100"
                            >
                              <LucideMail className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(n.id)}
                            className="opacity-70 hover:opacity-100"
                          >
                            <Trash2 className="w-4 h-4 text-destructive" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  );
}
