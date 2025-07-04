"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const reasonsForVisit = [
  "General Checkup",
  "Follow-up Appointment",
  "New Symptoms",
  "Lab Test",
  "Prescription Refill",
  "Vaccination",
  "Specialist Consultation",
  "Chronic Condition Management",
  "Injury or Accident",
];

export function VisitReasonPicker({
  setReason,
}: {
  setReason: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <div className="relative flex items-center border-2 border-gray-400 bg-gray-200 dark:bg-gray-950 dark:border-gray-200 h-14 w-full rounded-sm mt-2">
      <Select onValueChange={setReason} required>
        <SelectTrigger id="selectReason" className="w-full h-14 bg-transparent px-4 cursor-pointer">
          <SelectValue placeholder="Select a reason" />
        </SelectTrigger>
        <SelectContent>
          {reasonsForVisit.map((reason) => (
            <SelectItem key={reason} value={reason}>
              {reason}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
