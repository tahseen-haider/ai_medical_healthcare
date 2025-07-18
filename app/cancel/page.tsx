import React from "react";
import Link from "next/link";
import { XCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PaymentCancelledPage() {
  return (
    <div className="min-h-[calc(100vh-65px)] flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
      <Card className="w-full max-w-md text-center bg-white dark:bg-dark-4">
        <CardHeader>
          <XCircle className="mx-auto text-destructive mb-2" size={48} />
          <CardTitle className="text-2xl">Payment Cancelled</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-6">
            It looks like you cancelled your payment. If this was a mistake, you can try again.
          </p>
          <Button asChild className="w-full">
            <Link href="/your-appointments">Back to Appointments</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
