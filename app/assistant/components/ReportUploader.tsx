import { Camera } from "lucide-react";
export default function ReportUploader() {
  return (
    <label htmlFor="imageUpload"
      aria-label="Upload Report"
      className="
      bg-light-4
      "
      // bg-light-4 text-white shadow-light dark:shadow-dark cursor-pointer
    >
      <Camera size={24} />
    </label>
  );
}
