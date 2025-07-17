"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";

export default function ConnectionStatus() {
  const isOnlineRef = useRef<boolean | null>(null);

  useEffect(() => {
    const updateStatus = () => {
      const currentStatus = navigator.onLine;

      // Prevent showing a toast on first mount
      if (isOnlineRef.current !== null && currentStatus !== isOnlineRef.current) {
        toast(currentStatus ? "🟢 You are back online" : "🔴 You are offline", {
          description: currentStatus
            ? "Internet connection restored."
            : "You have lost connection.",
        });
      }

      isOnlineRef.current = currentStatus;
    };

    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);

    updateStatus(); // Set initial status

    return () => {
      window.removeEventListener("online", updateStatus);
      window.removeEventListener("offline", updateStatus);
    };
  }, []);

  return null; // No UI needed
}
