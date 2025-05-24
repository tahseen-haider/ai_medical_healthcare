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
        <header className="fixed top-0 w-full z-10 flex h-14 bg-background items-center gap-1 border-b px-6">
          <h1 className="text-xl font-semibold text-red-200 whitespace-nowrap">
            Medical Ai Assistant
          </h1>
          <div className="w-full flex justify-end gap-2">
            <ThemeToggler />
            <Drawer>
              <DrawerTrigger asChild>
                <Button variant={"outline"} size={"icon"} className="md:hidden">
                  <Settings />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="h-[80vh]">
                <DialogTitle hidden>Report Uploader</DialogTitle>
                <div className="pt-0 overflow-y-auto">
                  <ReportUploader onReportUpload={onReportUpload} />
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </header>
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
