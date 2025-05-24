"use client";

import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { ThemeToggler } from "@/components/header/theme-toggler";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import ReportUploader from "@/components/report-uploader";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useState } from "react";
import { toast } from "sonner";
import ChatComponent from "@/components/chat";

export default function AssistantPage() {
  const [reportData, setReportData] = useState("");
  const onReportUpload = (data: string) => {
    setReportData(data);
    toast("Report Uploaded Successfully");
    console.log(reportData);
  };
  return (
      <div className="relative h-screen">
        <main className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 relative top-14">
          <div className="hidden md:flex flex-col h-[calc(100vh-56px)] overflow-auto sticky top-14">
            <ReportUploader onReportUpload={onReportUpload} />
          </div>
          <div className="lg:col-span-2 p-4">
            <ChatComponent reportData={reportData}/>
          </div>
        </main>
      </div>
  );
}
