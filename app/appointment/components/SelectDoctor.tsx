import { getAllDoctors } from "@/actions/admin.action";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { $Enums } from "@prisma/client/edge";
import React from "react";

export default function SelectDoctor({
  setDoctorId,
  doctors,
}: {
  doctors: {
    id: string;
    name: string;
    role: $Enums.UserRole;
    email: string;
    doctorProfile: {
      doctorType: $Enums.DoctorType;
    } | null;
    createdAt: Date;
    pfp: string | null;
  }[];
  setDoctorId: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <div className="">
      <Select onValueChange={setDoctorId} required>
        <SelectTrigger className="h-full w-full" id="selectDoctor">
          <SelectValue placeholder="Select your doctor" />
        </SelectTrigger>
        <SelectContent>
          {doctors.map((doc) => (
            <SelectItem key={doc.id} value={doc.id} className="p-2">
              {doc.name} ({doc.doctorProfile?.doctorType})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
