import { Camera } from "lucide-react";
export default function ReportUploader() {
  return (
    <label htmlFor="imageUpload"
      aria-label="Upload Report"
      className="
      bg-light-4
      "
    >
      <Camera size={24} />
    </label>
  );
}
