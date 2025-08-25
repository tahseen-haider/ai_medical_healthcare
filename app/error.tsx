"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { usePathname } from "next/navigation";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const path = usePathname();
  const refreshPage = () => {
    window.location.href = path;
    try {
      reset();
    } catch {
      window.location.reload();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-64px)] overflow-hidden bg-gray-50 dark:bg-gray-950 p-4">
      <Card className="max-w-md w-full shadow-lg border border-red-900 bg-light-2 dark:bg-dark-4">
        <CardContent className="p-6 py-1 text-center">
          <div className="flex justify-center text-red-500 mb-4">
            <AlertTriangle className="w-12 h-12" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Something went wrong</h2>
          <p className="text-md font-semibold">
            {"Check your internet connection and try again."}
          </p>
          <Separator className="my-4" />
          <p className="text-muted-foreground mb-4 w-full overflow-x-scroll">
            {error.message || "An unexpected error occurred."}
          </p>
          <Button variant="destructive" onClick={refreshPage}>
            Try Again
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
