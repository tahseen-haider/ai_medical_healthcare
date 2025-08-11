"use client";
import { useEffect, useState } from "react";
import type React from "react";

import {
  Bell,
  ExternalLink,
  LucideMail,
  LucideMailOpen,
  MailCheck,
  Trash2,
} from "lucide-react";
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
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const fetcher = (userId: string) => getUserNotifications(userId);

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

export default function NotificationsComponent({ user }: { user: UserType }) {
  const {
    data: notifications,
    error,
    isLoading,
  } = useSWR(
    user?.id ? ["notifications", user.id] : null,
    () => fetcher(user.id),
    {
      refreshInterval: 10000,
      revalidateOnFocus: true,
      refreshWhenOffline: false,
      revalidateOnMount: true,
      shouldRetryOnError: true,
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
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    await deleteNotification(id);
  };

  const unreadCount = notifi.filter((n) => !n.read).length;

  const filtered = (type: string) => {
    const filteredNotifications = notifi.filter((n) => {
      if (type === "appointments") return n.type === "APPOINTMENT_UPDATE";
      return [
        "GENERAL_ANNOUNCEMENT",
        "SYSTEM_ALERT",
        "PRESCRIPTION_REMINDER",
      ].includes(n.type);
    });

    return filteredNotifications.sort((a, b) => {
      if (a.read !== b.read) {
        return a.read ? 1 : -1;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="relative p-0">
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-full h-full flex justify-center items-center">
                <Bell className="w-4 h-4 text-black dark:text-white" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                    {unreadCount}
                  </span>
                )}
              </div>
            </TooltipTrigger>
            <TooltipContent>Notifications</TooltipContent>
          </Tooltip>
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
                  className="cursor-pointer h-fit"
                  onClick={async () => {
                    setNotifications((prev) =>
                      prev.map((n) => ({ ...n, read: true }))
                    );
                    await markAllNotificationsAsRead(user!.id);
                  }}
                >
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="w-full h-fit">
                        <MailCheck size={26} />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="bottom">
                      Mark All as Read
                    </TooltipContent>
                  </Tooltip>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="w-full p-0 text-gray-600 dark:text-gray-400">
            <Tabs defaultValue="appointments">
              <TabsList className="grid grid-cols-2 w-full bg-transparent border-b-2 py-0 rounded-none">
                <TabsTrigger value="appointments" className="rounded-xs">
                  Appointments
                </TabsTrigger>
                <TabsTrigger value="general" className="rounded-xs">
                  General
                </TabsTrigger>
              </TabsList>
              <TabsContent value="appointments">
                <ScrollArea className="h-72 px-2 py-2">
                  {filtered("appointments").length === 0 ? (
                    <p className="text-sm text-center text-black dark:text-white">
                      No notifications.
                    </p>
                  ) : (
                    filtered("appointments").map((n) => (
                      <div
                        key={n.id}
                        className={`relative p-2 border-b flex items-start gap-3 rounded bg-transparent transition ${
                          n.read ? "" : "bg-accent text-black dark:text-white"
                        }`}
                      >
                        {!n.read && (
                          <div
                            className={`min-h-2 min-w-2 rounded-full mt-2 bg-light-4 dark:bg-white`}
                          />
                        )}
                        {n.read && <div />}
                        <div className="flex-grow">
                          <p className="text-sm font-medium">{n.title}</p>
                          <p className="text-sm">
                            {n.read
                              ? formatMessage(
                                  n.message,
                                  "text-gray-500",
                                  "text-gray-400"
                                )
                              : formatMessage(
                                  n.message,
                                  "text-green-700",
                                  "text-green-200"
                                )}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(n.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex flex-col gap-1 z-20 items-center">
                          {n.link && (
                            <Link
                              href={n.link}
                              className="flex justify-center items-center h-8 w-8 rounded-sm opacity-100 hover:opacity-90 text-light-4 dark:text-blue-300"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                          )}
                          {n.read ? (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleMarkAsUnread(n.id)}
                            >
                              <LucideMailOpen className="w-4 h-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleMarkAsRead(n.id)}
                            >
                              <MailCheck className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(n.id)}
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
                    <p className="text-sm text-center text-black dark:text-white">
                      No notifications.
                    </p>
                  ) : (
                    filtered("general").map((n) => (
                      <div
                        key={n.id}
                        className={`relative p-2 border-b flex items-start gap-3 rounded bg-transparent transition ${
                          n.read ? "" : "bg-accent text-black dark:text-white"
                        }`}
                      >
                        {!n.read && (
                          <div
                            className={`min-h-2 min-w-2 rounded-full mt-2 bg-light-4 dark:bg-white`}
                          />
                        )}
                        {n.read && <div />}
                        <div className="flex-grow">
                          <p className="text-sm font-medium">{n.title}</p>
                          <p className="text-sm">
                            {n.read
                              ? formatMessage(
                                  n.message,
                                  "text-gray-500",
                                  "text-gray-400"
                                )
                              : formatMessage(
                                  n.message,
                                  "text-green-700",
                                  "text-green-200"
                                )}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            {new Date(n.createdAt).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex flex-col gap-1 z-20 items-center">
                          {n.link && (
                            <Link
                              href={n.link}
                              className="flex justify-center items-center h-8 w-8 rounded-sm opacity-100 hover:opacity-90 text-light-4 dark:text-blue-300"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </Link>
                          )}
                          {n.read ? (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleMarkAsUnread(n.id)}
                            >
                              <LucideMailOpen className="w-4 h-4" />
                            </Button>
                          ) : (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleMarkAsRead(n.id)}
                            >
                              <MailCheck className="w-4 h-4" />
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(n.id)}
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
