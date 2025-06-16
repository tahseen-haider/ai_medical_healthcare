"use client";

import React, { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DateOfBirthPickerProps {
  value?: string; // Expected format: "YYYY-MM-DD"
  onChange: (dob: string | undefined) => void;
}

export const DateOfBirthPicker: React.FC<DateOfBirthPickerProps> = ({
  value,
  onChange,
}) => {
  const currentYear = new Date().getFullYear();

  const days = Array.from({ length: 31 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );
  const months = Array.from({ length: 12 }, (_, i) =>
    String(i + 1).padStart(2, "0")
  );
  const years = Array.from({ length: 100 }, (_, i) =>
    String(currentYear - i)
  );

  // Default to empty string to avoid switching between controlled/uncontrolled
  const [day, setDay] = useState<string>("");
  const [month, setMonth] = useState<string>("");
  const [year, setYear] = useState<string>("");

  // If value is provided, sync initial state
  useEffect(() => {
    if (value) {
      const [y, m, d] = value.split("-");
      setDay(d || "");
      setMonth(m || "");
      setYear(y || "");
    }
  }, [value]);

  // Compose date and notify parent
  useEffect(() => {
    if (year && month && day) {
      onChange(`${year}-${month}-${day}`);
    } else {
      onChange(undefined);
    }
  }, [day, month, year, onChange]);

  return (
    <div className="flex gap-2">
      {/* Day */}
      <Select value={day} onValueChange={setDay}>
        <SelectTrigger className="w-[80px]">
          <SelectValue placeholder="Day" />
        </SelectTrigger>
        <SelectContent>
          {days.map((d) => (
            <SelectItem key={d} value={d}>
              {d}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Month */}
      <Select value={month} onValueChange={setMonth}>
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="Month" />
        </SelectTrigger>
        <SelectContent>
          {months.map((m) => (
            <SelectItem key={m} value={m}>
              {m}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Year */}
      <Select value={year} onValueChange={setYear}>
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="Year" />
        </SelectTrigger>
        <SelectContent>
          {years.map((y) => (
            <SelectItem key={y} value={y}>
              {y}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
