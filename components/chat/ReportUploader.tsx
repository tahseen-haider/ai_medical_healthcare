import { Camera } from "lucide-react";
export default function ReportUploader() {
  return (
    <div
      aria-label="Upload Report"
      className="bg-light-4 text-white p-2 rounded-full relative -top-5 shadow-light dark:shadow-dark cursor-pointer"
    >
      <Camera size={28} />
    </div>
  );
}
