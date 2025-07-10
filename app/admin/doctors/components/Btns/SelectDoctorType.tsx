import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";

export default function SelectDoctorType({
  setDocType,
}: {
  setDocType: React.Dispatch<React.SetStateAction<string>>;
}) {
  const doctorTypes = [
    "general",
    "cardiologist",
    "dermatologist",
    "pediatrician",
    "neurologist",
    "psychiatrist",
    "dentist",
    "surgeon",
    "gynecologist",
    "orthopedist",
  ];

  return (
    <div className="relative flex items-center border-[1px] bg-gray-200 dark:bg-gray-950 border-gray-400 dark:border-gray-200 h-14 w-full rounded-sm mt-2">
      <Select onValueChange={setDocType} required>
        <SelectTrigger id="docType" className="w-full h-14 bg-transparent px-4 cursor-pointer">
          <SelectValue placeholder="Doctor Type" />
        </SelectTrigger>

        <SelectContent>
          {doctorTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {type[0].toUpperCase() + type.slice(1)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
