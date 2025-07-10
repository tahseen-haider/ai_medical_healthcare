// components/TimePicker.tsx
"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Time = {
  hour: string;
  minute: string;
  ampm: "AM" | "PM";
};

interface TimePickerProps {
  value: Time;
  onChange: (value: Time) => void;
}

export const TimePicker: React.FC<TimePickerProps> = ({ value, onChange }) => {
  const hours = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    String(i).padStart(2, "0")
  );

  return (
    <div className="relative flex items-center gap-2 border-[1px] bg-gray-200 dark:bg-gray-950 border-gray-400 dark:border-gray-200 h-14 w-full p-4 rounded-sm mt-2 ">
      {/* Hour */}
      <Select
        value={value.hour}
        onValueChange={(hour) => onChange({ ...value, hour })}
      >
        <div>
          <SelectTrigger className="w-full h-14" id="selectTime">
            <SelectValue
              placeholder="HH"
              className="h-full flex items-center"
            />
          </SelectTrigger>
        </div>
        <SelectContent>
          {hours.map((h) => (
            <SelectItem key={h} value={h}>
              {h}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <span className="text-xl px-1">:</span>

      {/* Minute */}
      <Select
        value={value.minute}
        onValueChange={(minute) => onChange({ ...value, minute })}
      >
        <div>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="MM" />
          </SelectTrigger>
        </div>
        <SelectContent>
          {minutes.map((m) => (
            <SelectItem key={m} value={m}>
              {m}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* AM/PM */}
      <Select
        value={value.ampm}
        onValueChange={(ampm) =>
          onChange({ ...value, ampm: ampm as "AM" | "PM" })
        }
      >
        <div>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="AM/PM" />
          </SelectTrigger>
        </div>
        <SelectContent>
          <SelectItem value="AM">AM</SelectItem>
          <SelectItem value="PM">PM</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};
