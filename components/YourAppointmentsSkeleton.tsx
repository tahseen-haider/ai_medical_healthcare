import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "./ui/button";
import { RefreshCw } from "lucide-react";

export default function YourAppointmentsSkeleton() {
  return (
    <Card className="bg-gray-50 dark:bg-dark-4 min-h-[calc(100vh-160px)]">
      <CardHeader className="flex items-center justify-between">
        <CardTitle className="text-2xl font-bold">
          <Skeleton className="h-6 w-40" />
        </CardTitle>
        <Button variant="default" disabled>
          <RefreshCw size={40} className="animate-spin" />
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col justify-between flex-1">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                {["Name", "Reason", "Time", "Date", "Status", "Messages"].map((header) => (
                  <TableHead key={header}>
                    <Skeleton className="h-4 w-20" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 6 }).map((__, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="flex justify-end items-center gap-3 mt-4">
          <Skeleton className="h-6 w-20 rounded-md" />
          <Skeleton className="h-6 w-16 rounded-md" />
          <Skeleton className="h-6 w-20 rounded-md" />
        </div>
      </CardContent>
    </Card>
  );
}
